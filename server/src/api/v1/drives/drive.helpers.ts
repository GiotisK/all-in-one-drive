import GoogleDriveStrategy from '../../../services/drive/GoogleDriveStrategy';
import { IDriveStrategy } from '../../../services/drive/IDriveStrategy';

export const getDriveStrategyFromString = (drive: string): IDriveStrategy | null => {
	switch (drive) {
		case 'googledrive':
			return new GoogleDriveStrategy();
		default:
			return null;
	}
};
