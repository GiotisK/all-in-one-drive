import {
	getEncryptedTokenAsString,
	saveDriveProperties,
} from '../../../services/database/mongodb.service';
import DriveContext from '../../../services/drive/DriveContext';
import { DriveQuota } from '../../../services/drive/drive.types';
import { EncryptedData, decrypt, encrypt } from '../../../services/encryption/encryption.service';
import { DriveType } from '../../../types/global.types';
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
			const encryptedToken = JSON.parse(encryptedTokenStr) as EncryptedData;
			const token = decrypt(encryptedToken);
			const quota = ctx.getDriveQuota(token);

			return quota;
		}
	}
	return null;
};
