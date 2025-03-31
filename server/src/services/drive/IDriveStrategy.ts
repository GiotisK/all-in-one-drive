import {
	FileEntity,
	DriveQuota,
	Nullable,
	WatchChangesChannel,
	DriveChanges,
	FileType,
} from '../../types/global.types';

export interface IDriveStrategy {
	getAuthLink(): Nullable<string>;
	generateOAuth2token(authCode: string, driveId: string): Promise<string>;
	getUserDriveEmail(token: string): Promise<string>;
	getDriveQuota(token: string): Promise<Nullable<DriveQuota>>;
	getDriveFiles(
		token: string,
		driveId: string,
		folderId?: string
	): Promise<Nullable<FileEntity[]>>;
	deleteFile(token: string, fileId: string): Promise<boolean>;
	renameFile(token: string, fileId: string, name: string): Promise<boolean>;
	shareFile(token: string, fileId: string): Promise<Nullable<string>>;
	unshareFile(token: string, fileId: string): Promise<boolean>;
	createFile(
		token: string,
		fileType: FileType,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>>;
	downloadFile(token: string, fileId: string, driveId: string): Promise<boolean>;
	uploadFile(
		token: string,
		file: Express.Multer.File,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>>;
	openFile: (token: string, fileId: string) => Promise<Nullable<string>>;
	subscribeForChanges(token: string, driveId: string): Promise<WatchChangesChannel | null>;
	unsubscribeForChanges(token: string, id: string, resourceId: string): Promise<boolean>;
	fetchDriveChanges(
		token: string,
		driveEmail: string,
		driveId: string
	): Promise<Nullable<DriveChanges>>;
}
