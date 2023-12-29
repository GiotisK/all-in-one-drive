import { saveToken } from '../../../services/database/mongodb.service';
import DriveContext from '../../../services/drive/DriveContext';
import { encrypt } from '../../../services/encryption/encryption.service';
import { getDriveStrategyFromString } from './drive.helpers';

export const getAuthLink = (drive: string): string | undefined => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const authLink = ctx.getAuthLink();
		return authLink;
	}
};

export const generateOAuth2Token = async (authCode: string, drive: string): Promise<boolean> => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const token = await ctx.generateOAuth2token(authCode);

		if (token) {
			const encryptedTokenData = encrypt(token);
			const driveEmail = await ctx.getUserDriveEmail(token);

			saveToken(encryptedTokenData, driveEmail);

			return true;
		}
	}

	return false;
};
