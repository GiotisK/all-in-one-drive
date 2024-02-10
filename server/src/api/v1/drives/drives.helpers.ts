import DriveContext from '../../../services/drive/DriveContext';
import GoogleDriveStrategy from '../../../services/drive/GoogleDriveStrategy';
import { IDriveStrategy } from '../../../services/drive/IDriveStrategy';
import EncryptionService from '../../../services/encryption/encryption.service';
import { Nullable } from '../../../types/global.types';

export const getDriveStrategyFromString = (drive: string): Nullable<IDriveStrategy> => {
	switch (drive) {
		case 'googledrive':
			return new GoogleDriveStrategy();
		default:
			return null;
	}
};

export const getDriveContextAndToken = (drive: string, encryptedTokenStr?: string) => {
	const driveStrategy = getDriveStrategyFromString(drive);
	if (driveStrategy) {
		let token = '';
		if (encryptedTokenStr) {
			token = EncryptionService.getDecryptedTokenFromEncryptedTokenString(encryptedTokenStr);
		}
		const ctx = new DriveContext(driveStrategy);
		return { ctx, token };
	}
	return null;
};
