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

	public async generateOAuth2token(authCode: string): Promise<boolean> {
		return this.strategy.generateOAuth2token(authCode);
	}
}
