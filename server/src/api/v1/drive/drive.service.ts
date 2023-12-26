import DriveContext from '../../drive-services/DriveContext';
import { getDriveStrategyFromString } from './drive.helpers';

export const getAuthLink = (drive: string): string | undefined => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const authLink = ctx.getAuthLink();
		return authLink;
	}
};
