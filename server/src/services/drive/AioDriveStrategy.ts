import {
	Nullable,
	DriveQuota,
	FileEntity,
	FileType,
	WatchChangesChannel,
	DriveChanges,
} from '../../types/global.types';
import { DriveQuotaBytes } from '../../types/types';
import { IDriveStrategy } from './IDriveStrategy';

export default class AioDriveStrategy implements IDriveStrategy {
	getOrCreateVirtualDriveFolder(token: string, driveId: string): Promise<Nullable<string>> {
		throw new Error('Method not implemented.');
	}
	getAuthLink(): Promise<Nullable<string>> {
		throw new Error('Method not implemented.');
	}
	generateOAuth2token(authCode: string, driveId: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
	getUserDriveEmail(token: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
	getDriveQuota(token: string): Promise<Nullable<DriveQuotaBytes>> {
		throw new Error('Method not implemented.');
	}
	getDriveFiles(
		token: string,
		driveId: string,
		folderId?: string
	): Promise<Nullable<FileEntity[]>> {
		throw new Error('Method not implemented.');
	}
	deleteFile(token: string, fileId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	renameFile(token: string, fileId: string, name: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	shareFile(token: string, fileId: string): Promise<Nullable<string>> {
		throw new Error('Method not implemented.');
	}
	unshareFile(token: string, fileId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	createFile(
		token: string,
		fileType: FileType,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		throw new Error('Method not implemented.');
	}
	downloadFile(token: string, fileId: string, driveId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	uploadFile(
		token: string,
		file: Express.Multer.File,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		throw new Error('Method not implemented.');
	}
	openFile(token: string, fileId: string): Promise<Nullable<string>> {
		throw new Error('Method not implemented.');
	}
	subscribeForChanges(token: string, driveId: string): Promise<WatchChangesChannel | null> {
		throw new Error('Method not implemented.');
	}
	unsubscribeForChanges(token: string, id: string, resourceId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	fetchDriveChanges(
		token: string,
		driveEmail: string,
		driveId: string
	): Promise<Nullable<DriveChanges>> {
		throw new Error('Method not implemented.');
	}
}
