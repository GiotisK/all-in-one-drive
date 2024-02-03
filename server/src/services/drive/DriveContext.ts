import { DriveQuota, FileEntity, Nullable } from '../../types/global.types';
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

	public async shareFile(
		token: string,
		fileId: string,
		share: boolean
	): Promise<Nullable<string>> {
		return this.strategy.shareFile(token, fileId, share);
	}
}
