import DriveContext from '../../../services/drive/DriveContext';
import DropboxStrategy from '../../../services/drive/DropboxStrategy';
import GoogleDriveStrategy from '../../../services/drive/GoogleDriveStrategy';
import { IDriveStrategy } from '../../../services/drive/IDriveStrategy';
import OneDriveStrategy from '../../../services/drive/OneDriveStrategy';
import EncryptionService from '../../../services/encryption/encryption.service';
import { DriveType, Nullable } from '../../../types/global.types';

export const getDriveStrategyFromString = (drive: string): Nullable<IDriveStrategy> => {
	switch (drive) {
		case DriveType.GoogleDrive:
			return new GoogleDriveStrategy();
		case DriveType.Dropbox:
			return new DropboxStrategy();
		case DriveType.OneDrive:
			return new OneDriveStrategy();
		case DriveType.VirtualDrive:
			return null;
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
