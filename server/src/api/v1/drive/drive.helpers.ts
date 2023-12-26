import GoogleDriveStrategy from '../../drive-services/GoogleDriveStrategy';
import { IDriveStrategy } from '../../drive-services/IDriveStrategy';

export const getDriveStrategyFromString = (drive: string): IDriveStrategy | null => {
	switch (drive) {
		case 'googledrive':
			return new GoogleDriveStrategy();
		default:
			return null;
	}
};
