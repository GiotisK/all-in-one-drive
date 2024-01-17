import {
	deleteDriveProperties,
	getDriveProperties,
	getEncryptedTokenAsString,
	saveDriveProperties,
} from '../../../services/database/mongodb.service';
import DriveContext from '../../../services/drive/DriveContext';
import { EncryptedData, decrypt, encrypt } from '../../../services/encryption/encryption.service';
import { DriveEntity, DriveQuota, DriveType } from '../../../types/global.types';
import { getDriveStrategyFromString } from './drive.helpers';

export const getAuthLink = (drive: string): string | undefined => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const authLink = ctx.getAuthLink();
		return authLink;
	}
};

export const generateAndSaveOAuth2Token = async (
	authCode: string,
	drive: DriveType,
	userEmail: string
): Promise<boolean> => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const tokenData = await ctx.generateOAuth2token(authCode);

		if (tokenData) {
			const encryptedTokenData = encrypt(tokenData);
			const driveEmail = await ctx.getUserDriveEmail(tokenData);
			const success = await saveDriveProperties(
				encryptedTokenData,
				driveEmail,
				userEmail,
				drive
			);

			return success;
		}
	}
	return false;
};

export const getDriveQuota = async (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
): Promise<DriveQuota | null> => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const encryptedTokenStr = await getEncryptedTokenAsString(userEmail, driveEmail, drive);

		if (encryptedTokenStr) {
			//TODO:: extract helper function for decryption of token
			const encryptedToken = JSON.parse(encryptedTokenStr) as EncryptedData;
			const token = decrypt(encryptedToken);
			const quota = ctx.getDriveQuota(token);

			return quota;
		}
	}
	return null;
};

export const getDriveEntities = async (userEmail: string): Promise<DriveEntity[] | null> => {
	const driveProperties = await getDriveProperties(userEmail);
	if (driveProperties) {
		const driveEntities: DriveEntity[] = [];
		let promiseArr: Promise<DriveQuota | null>[] = [];

		try {
			driveProperties.forEach(async properties => {
				const { token: encryptedTokenStr, driveType, email } = properties;
				const driveStrategy = getDriveStrategyFromString(driveType);

				if (driveStrategy) {
					//TODO:: extract helper function for decryption of token
					const encryptedToken = JSON.parse(encryptedTokenStr) as EncryptedData;
					const token = decrypt(encryptedToken);

					const ctx = new DriveContext(driveStrategy);
					promiseArr.push(ctx.getDriveQuota(token));
				}
			});

			const quotas = await Promise.all(promiseArr);

			quotas.forEach((quota, index) => {
				const { email, driveType } = driveProperties[index];

				if (quota) {
					driveEntities.push({
						email,
						type: driveType,
						quota,
					});
				}
			});

			return driveEntities;
		} catch {
			return null;
		}
	}

	return null;
};

export const deleteDriveEntity = (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
): Promise<boolean | null> => {
	return deleteDriveProperties(userEmail, driveEmail, drive);
};
