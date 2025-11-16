import { DriveType, Nullable } from '../../types/global.types';
import { DriveDTO, UserDTO } from './types';

export interface IDatabaseService {
	connect(): void;
	saveUser(email: string, password: string): Promise<boolean>;
	getUser(email: string): Promise<Nullable<UserDTO>>;
	saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		drive: DriveType,
		driveId: string
	): Promise<boolean>;
	getAllDrives(userEmail: string): Promise<Nullable<DriveDTO[]>>;
	getDrive(userEmail: string, driveId: string): Promise<Nullable<DriveDTO>>;
	deleteDrive(userEmail: string, driveId: string): Promise<boolean>;
	updateToken(driveId: string, encryptedTokenData: string): Promise<boolean>;
	checkDriveExistance(
		useEmail: string,
		driveEmail: string,
		driveType: DriveType
	): Promise<boolean>;
}
