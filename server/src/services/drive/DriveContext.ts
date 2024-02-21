import {
	DriveChanges,
	DriveQuota,
	FileEntity,
	FileType,
	Nullable,
	WatchChangesChannel,
} from '../../types/global.types';
import { IDriveStrategy } from './IDriveStrategy';

export default class DriveContext {
	private strategy: IDriveStrategy;

	constructor(strategy: IDriveStrategy) {
		this.strategy = strategy;
	}

	public setStrategy(strategy: IDriveStrategy) {
		this.strategy = strategy;
	}

	public getAuthLink(): string {
		return this.strategy.getAuthLink();
	}

	public async generateOAuth2token(authCode: string): Promise<string> {
		return this.strategy.generateOAuth2token(authCode);
	}

	public async getUserDriveEmail(token: string): Promise<string> {
		return this.strategy.getUserDriveEmail(token);
	}

	public async getDriveQuota(token: string): Promise<Nullable<DriveQuota>> {
		return this.strategy.getDriveQuota(token);
	}

	public async getDriveFiles(token: string, folderId?: string): Promise<Nullable<FileEntity[]>> {
		return this.strategy.getDriveFiles(token, folderId);
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
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		return this.strategy.createFile(token, fileType, parentFolderId);
	}

	public async subscribeForChanges(
		token: string,
		driveEmail: string
	): Promise<WatchChangesChannel | undefined> {
		return this.strategy.subscribeForChanges(token, driveEmail);
	}

	public async unsubscribeForChanges(
		token: string,
		id: string,
		resourceId: string
	): Promise<void> {
		return this.strategy.unsubscribeForChanges(token, id, resourceId);
	}

	public async fetchDriveChanges(
		token: string,
		startPageToken: string
	): Promise<DriveChanges | undefined> {
		return this.strategy.fetchDriveChanges(token, startPageToken);
	}
}
