import { saveDriveProperties } from '../../../services/database/mongodb.service';
import DriveContext from '../../../services/drive/DriveContext';
import { encrypt } from '../../../services/encryption/encryption.service';
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
			const sucess = await saveDriveProperties(
				encryptedTokenData,
				driveEmail,
				userEmail,
				drive
			);

			return sucess;
		}
	}
	return false;
};
