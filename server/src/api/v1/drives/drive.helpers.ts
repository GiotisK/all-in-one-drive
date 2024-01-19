import GoogleDriveStrategy from '../../../services/drive/GoogleDriveStrategy';
import { IDriveStrategy } from '../../../services/drive/IDriveStrategy';
import { Nullable } from '../../../types/global.types';

export const getDriveStrategyFromString = (drive: string): Nullable<IDriveStrategy> => {
	switch (drive) {
		case 'googledrive':
			return new GoogleDriveStrategy();
		default:
			return null;
	}
};
