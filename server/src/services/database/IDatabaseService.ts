import { DriveSchema, UserSchema } from '../../models/user.model';
import { DriveType, Nullable } from '../../types/global.types';

export interface IDatabaseService {
	connect(): void;
	saveUser(email: string, password: string): Promise<boolean>;
	getUser(email: string): Promise<Nullable<UserSchema>>;
	saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		drive: DriveType
	): Promise<boolean>;
	getEncryptedTokenAsString(userEmail: string, driveId: string): Promise<Nullable<string>>;
	getAllDrives(userEmail: string): Promise<Nullable<DriveSchema[]>>;
	getDrive(userEmail: string, driveId: string): Promise<Nullable<DriveSchema>>;
	deleteDrive(userEmail: string, driveId: string): Promise<boolean>;
}
