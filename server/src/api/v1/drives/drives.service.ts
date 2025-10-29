import { bytesToGigabytes, generateUUID } from '../../../helpers/helpers';
import DatabaseService from '../../../services/database/DatabaseFactory';
import { DriveDTO } from '../../../services/database/types';
import EncryptionService from '../../../services/encryption/encryption.service';
import {
	DriveChanges,
	DriveEntity,
	DriveQuota,
	DriveType,
	Nullable,
	WatchChangesChannel,
} from '../../../types/global.types';
import { DriveQuotaBytes } from '../../../types/types';
import { getDriveContextAndToken } from './drives.helpers';

export class DrivesService {
	async getAuthLink(drive: string): Promise<string | undefined> {
		const ctxAndToken = getDriveContextAndToken(drive);
		if (ctxAndToken) {
			const { ctx } = ctxAndToken;
			const authLink = await ctx.getAuthLink();

			return authLink ?? undefined;
		}
	}

	async connectDrive(authCode: string, drive: DriveType, userEmail: string): Promise<boolean> {
		const ctxAndToken = getDriveContextAndToken(drive);

		if (ctxAndToken) {
			const { ctx } = ctxAndToken;
			const driveId = generateUUID();
			const tokenData = await ctx.generateOAuth2token(authCode, driveId);

			if (tokenData) {
				const driveEmail = await ctx.getUserDriveEmail(tokenData);

				const exists = await DatabaseService.checkDriveExistance(driveEmail, drive);

				if (exists) {
					return false;
				}

				const encryptedTokenData = EncryptionService.encrypt(tokenData);

				await ctx.getOrCreateVirtualDriveFolder(tokenData, driveId);

				const success = await DatabaseService.saveDrive(
					encryptedTokenData,
					driveEmail,
					userEmail,
					drive,
					driveId
				);
				return success;
			}
		}
		return false;
	}

	async getDriveQuota(userEmail: string, driveId: string): Promise<Nullable<DriveQuota>> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (drive) {
			const { driveType, token: encryptedTokenAsString } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenAsString);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				const quota = await ctx.getDriveQuota(token);

				if (quota === null) return null;

				return {
					used: bytesToGigabytes('' + quota?.used),
					total: bytesToGigabytes('' + quota?.total),
				};
			}
		}
		return null;
	}

	async getDrives(userEmail: string): Promise<Nullable<DriveEntity[]>> {
		const driveProperties = await DatabaseService.getAllDrives(userEmail);

		if (driveProperties) {
			const driveEntities: DriveEntity[] = [];
			const promiseArr: Promise<Nullable<DriveQuotaBytes>>[] = [];

			try {
				driveProperties.forEach(async properties => {
					const { token: encryptedTokenStr, driveType } = properties;
					const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);
					if (ctxAndToken) {
						const { ctx, token } = ctxAndToken;
						promiseArr.push(ctx.getDriveQuota(token));
					}
				});

				const quotas = await Promise.all(promiseArr);

				quotas.forEach((quota, index) => {
					const { email, driveType, id } = driveProperties[index];

					if (quota) {
						driveEntities.push({
							id: id,
							email,
							type: driveType,
							quota: {
								used: bytesToGigabytes('' + quota?.used),
								total: bytesToGigabytes('' + quota?.total),
							},
						});
					}
				});

				return driveEntities;
			} catch {
				return null;
			}
		}

		return null;
	}

	public async deleteDrive(userEmail: string, driveId: string): Promise<Nullable<boolean>> {
		return DatabaseService.deleteDrive(userEmail, driveId);
	}

	public async subscribeForDriveChanges(
		userEmail: string,
		driveIds: string[]
	): Promise<WatchChangesChannel[] | null> {
		try {
			const drivesPromises: Promise<Nullable<DriveDTO>>[] = [];

			driveIds.forEach(driveId => {
				drivesPromises.push(DatabaseService.getDrive(userEmail, driveId));
			});

			const drives = await Promise.all(drivesPromises);

			const watchChangesChanelPromises = drives.map(drive => {
				if (!drive) return Promise.resolve(null);

				const { driveType, token: encryptedToken, id: driveId } = drive;
				const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

				if (!ctxAndToken) {
					return Promise.resolve(null);
				}

				const { ctx, token } = ctxAndToken;
				return ctx.subscribeForChanges(token, driveId);
			});

			const watchChangesChannels = await Promise.all(watchChangesChanelPromises);

			return watchChangesChannels.filter(
				(channel): channel is WatchChangesChannel => channel !== null
			);
		} catch {
			return null;
		}
	}

	public async unsubscribeForDriveChanges(
		userEmail: string,
		driveId: string,
		id: string,
		resourceId: string
	): Promise<boolean> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (!drive) {
			return false;
		}

		const { driveType, token: encryptedToken } = drive;
		const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);
		if (!ctxAndToken) {
			return false;
		}

		const { ctx, token } = ctxAndToken;
		const success = await ctx.unsubscribeForChanges(token, id, resourceId);

		return success;
	}

	public async fetchDriveChanges(
		driveId: string,
		userEmail: string,
		startPageToken: string
	): Promise<Nullable<DriveChanges>> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (!drive) {
			return null;
		}

		const { driveType, token: encryptedToken } = drive;
		const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);
		if (!ctxAndToken) {
			return null;
		}

		const { ctx, token } = ctxAndToken;
		const changes = await ctx.fetchDriveChanges(token, startPageToken, driveId);

		return changes;
	}
}

export default new DrivesService();
