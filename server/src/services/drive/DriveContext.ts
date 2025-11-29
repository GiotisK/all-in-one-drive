import {
	DriveChanges,
	FileEntity,
	FileType,
	Nullable,
	WatchChangesChannel,
} from '../../types/global.types';
import { DriveQuotaBytes } from '../../types/types';
import { IDriveStrategy } from './IDriveStrategy';

export default class DriveContext {
	private strategy: IDriveStrategy;

	constructor(strategy: IDriveStrategy) {
		this.strategy = strategy;
	}

	public getOrCreateVirtualDriveFolder(
		token: string,
		driveId: string
	): Promise<Nullable<string>> {
		return this.strategy.getOrCreateVirtualDriveFolder(token, driveId);
	}

	public setStrategy(strategy: IDriveStrategy) {
		this.strategy = strategy;
	}

	public getAuthLink(): Promise<Nullable<string>> {
		return this.strategy.getAuthLink();
	}

	public async generateOAuth2token(authCode: string, driveId: string): Promise<string> {
		return this.strategy.generateOAuth2token(authCode, driveId);
	}

	public async getUserDriveEmail(token: string): Promise<string> {
		return this.strategy.getUserDriveEmail(token);
	}

	public async getDriveQuota(token: string): Promise<Nullable<DriveQuotaBytes>> {
		return this.strategy.getDriveQuota(token);
	}

	public async getDriveFiles(
		token: string,
		driveId: string,
		folderId?: string
	): Promise<Nullable<FileEntity[]>> {
		return this.strategy.getDriveFiles(token, driveId, folderId);
	}

	public async deleteFile(token: string, fileId: string): Promise<boolean> {
		return this.strategy.deleteFile(token, fileId);
	}

	public async renameFile(token: string, fileId: string, name: string): Promise<boolean> {
		return this.strategy.renameFile(token, fileId, name);
	}

	public async shareFile(token: string, fileId: string): Promise<Nullable<string>> {
		return this.strategy.shareFile(token, fileId);
	}

	public async unshareFile(token: string, fileId: string): Promise<boolean> {
		return this.strategy.unshareFile(token, fileId);
	}

	public async createFile(
		token: string,
		fileType: FileType,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		return this.strategy.createFile(token, fileType, driveId, parentFolderId);
	}

	public async downloadFile(token: string, fileId: string, driveId: string): Promise<boolean> {
		return this.strategy.downloadFile(token, fileId, driveId);
	}

	public async uploadFile(
		token: string,
		file: Express.Multer.File,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		return this.strategy.uploadFile(token, file, driveId, parentFolderId);
	}

	public async openFile(token: string, fileId: string): Promise<Nullable<string>> {
		return this.strategy.openFile(token, fileId);
	}

	public async subscribeForChanges(
		token: string,
		driveId: string
	): Promise<WatchChangesChannel | null> {
		return this.strategy.subscribeForChanges(token, driveId);
	}

	public async unsubscribeForChanges(
		token: string,
		id: string,
		resourceId: string
	): Promise<boolean> {
		return this.strategy.unsubscribeForChanges(token, id, resourceId);
	}

	public async fetchDriveChanges(
		token: string,
		startPageToken: string,
		driveId: string
	): Promise<Nullable<DriveChanges>> {
		return this.strategy.fetchDriveChanges(token, startPageToken, driveId);
	}

	public async getThumbnailLink(token: string, fileId: string): Promise<Nullable<string>> {
		return this.strategy.getThumbnailLink(token, fileId);
	}
}
