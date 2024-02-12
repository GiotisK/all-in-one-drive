import DatabaseService from '../../../services/database/mongodb.service';
import EncryptionService from '../../../services/encryption/encryption.service';
import { DriveEntity, DriveQuota, DriveType, Nullable } from '../../../types/global.types';
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

	async getDriveQuota(
		userEmail: string,
		driveEmail: string,
		drive: DriveType
	): Promise<Nullable<DriveQuota>> {
		const encryptedTokenStr = await DatabaseService.getEncryptedTokenAsString(
			userEmail,
			driveEmail,
			drive
		);
		if (encryptedTokenStr) {
			const ctxAndToken = getDriveContextAndToken(drive, encryptedTokenStr);
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

	deleteDrive(
		userEmail: string,
		driveEmail: string,
		drive: DriveType
	): Promise<Nullable<boolean>> {
		return DatabaseService.deleteDrive(userEmail, driveEmail, drive);
	}
}

export default new DrivesService();
