import { IDriveStrategy } from './IDriveStrategy';
import { DriveQuota } from './drive.types';

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

	public async getDriveQuota(token: string): Promise<DriveQuota | null> {
		return this.strategy.getDriveQuota(token);
	}
}
