import {
	FileEntity,
	DriveQuota,
	Nullable,
	WatchChangesChannel,
	DriveChanges,
	FileType,
} from '../../types/global.types';

export interface IDriveStrategy {
	getAuthLink(): string;
	generateOAuth2token(authCode: string): Promise<string>;
	getUserDriveEmail(token: string): Promise<string>;
	getDriveQuota(token: string): Promise<Nullable<DriveQuota>>;
	getDriveFiles(
		token: string,
		dbEntityDriveId: string,
		folderId?: string
	): Promise<Nullable<FileEntity[]>>;
	deleteFile(token: string, fileId: string): Promise<boolean>;
	renameFile(token: string, fileId: string, name: string): Promise<boolean>;
	shareFile(token: string, fileId: string): Promise<Nullable<string>>;
	unshareFile(token: string, fileId: string): Promise<boolean>;
	createFile(
		token: string,
		fileType: FileType,
		dbEntityDriveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>>;
	downloadFile(token: string, fileId: string): Promise<boolean>;
	subscribeForChanges(
		token: string,
		driveEmail: string
	): Promise<WatchChangesChannel | undefined>;
	unsubscribeForChanges(token: string, id: string, resourceId: string): Promise<void>;
	fetchDriveChanges(token: string, driveEmail: string): Promise<DriveChanges | undefined>;
}
