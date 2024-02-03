import { FileEntity, DriveQuota, Nullable, DriveType } from '../../types/global.types';

export interface IDriveStrategy {
	getAuthLink(): string;
	generateOAuth2token(authCode: string): Promise<string>;
	getUserDriveEmail(token: string): Promise<string>;
	getDriveQuota(token: string): Promise<Nullable<DriveQuota>>;
	getDriveFiles(token: string, folderId?: string): Promise<Nullable<FileEntity[]>>;
	deleteFile(token: string, fileId: string): Promise<boolean>;
	renameFile(token: string, fileId: string, name: string): Promise<boolean>;
	shareFile(token: string, fileId: string): Promise<Nullable<string>>;
	unshareFile(token: string, fileId: string): Promise<boolean>;
}
