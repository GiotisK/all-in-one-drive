import DatabaseService from '../../../services/database/mongodb.service';
import EncryptionService from '../../../services/encryption/encryption.service';
import {
	DriveEntity,
	DriveQuota,
	DriveType,
	Nullable,
	WatchChangesChannel,
} from '../../../types/global.types';
import { getDriveContextAndToken } from './drives.helpers';

export class DrivesService {
	getAuthLink(drive: string): string | undefined {
		const ctxAndToken = getDriveContextAndToken(drive);
		if (ctxAndToken) {
			const { ctx } = ctxAndToken;
			const authLink = ctx.getAuthLink();
			return authLink;
		}
	}

	async generateAndSaveOAuth2Token(
		authCode: string,
		drive: DriveType,
		userEmail: string
	): Promise<boolean> {
		const ctxAndToken = getDriveContextAndToken(drive);

		if (ctxAndToken) {
			const { ctx } = ctxAndToken;
			const tokenData = await ctx.generateOAuth2token(authCode);

			if (tokenData) {
				const encryptedTokenData = EncryptionService.encrypt(tokenData);
				const driveEmail = await ctx.getUserDriveEmail(tokenData);
				const success = await DatabaseService.saveDrive(
					encryptedTokenData,
					driveEmail,
					userEmail,
					drive
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
				return quota;
			}
		}
		return null;
	}

	async getDrives(userEmail: string): Promise<Nullable<DriveEntity[]>> {
		const driveProperties = await DatabaseService.getAllDrives(userEmail);

		if (driveProperties) {
			const driveEntities: DriveEntity[] = [];
			const promiseArr: Promise<Nullable<DriveQuota>>[] = [];

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
							quota,
							active: true,
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

	// TODO: These all use the same logic to get the token
	// Maybe extract it to a common
	public async subscribeForDriveChanges(
		userEmail: string,
		driveId: string
	): Promise<WatchChangesChannel | undefined> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (!drive) {
			return;
		}

		const { driveType, token: encryptedToken, email: driveEmail } = drive;
		const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);
		if (!ctxAndToken) {
			return;
		}

		const { ctx, token } = ctxAndToken;
		const watchChangesChannel = await ctx.subscribeForChanges(token, driveEmail);
		return watchChangesChannel;
	}

	public async unsubscribeForDriveChanges(
		userEmail: string,
		driveId: string,
		id: string,
		resourceId: string
	): Promise<void> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (!drive) {
			return;
		}

		const { driveType, token: encryptedToken } = drive;
		const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);
		if (!ctxAndToken) {
			return;
		}

		const { ctx, token } = ctxAndToken;
		const watchChangesChannel = await ctx.unsubscribeForChanges(token, id, resourceId);
		return watchChangesChannel;
	}

	public async fetchDriveChanges(
		driveId: string,
		userEmail: string,
		startPageToken: string
	): Promise<any> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (!drive) {
			return;
		}

		const { driveType, token: encryptedToken } = drive;
		const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);
		if (!ctxAndToken) {
			return;
		}

		const { ctx, token } = ctxAndToken;
		const changes = await ctx.fetchDriveChanges(token, startPageToken);
		return changes;
	}
}

export default new DrivesService();
