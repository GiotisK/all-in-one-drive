import { DriveType, Nullable } from '../../../types/global.types';
import { DriveDTO } from '../types';

export interface IDriveRepository {
	saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		drive: DriveType,
		driveId: string,
		virtualFolderId: string
	): Promise<boolean>;
	getAllDrives(userEmail: string): Promise<Nullable<DriveDTO[]>>;
	checkDriveExistance(
		_userEmail: string,
		driveEmail: string,
		driveType: DriveType
	): Promise<boolean>;
	getDrive(_userEmail: string, driveId: string): Promise<Nullable<DriveDTO>>;
	deleteDrive(_userEmail: string, driveId: string): Promise<boolean>;
	updateToken(driveId: string, encryptedTokenData: string): Promise<boolean>;
}
