import DriveContext from '../../../services/drive/DriveContext';
import { getDriveStrategyFromString } from './drive.helpers';

export const getAuthLink = (drive: string): string | undefined => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const authLink = ctx.getAuthLink();
		return authLink;
	}
};

export const generateOAuth2Token = async (authCode: string, drive: string) => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const success = await ctx.generateOAuth2token(authCode);

		return success;
	}
};
