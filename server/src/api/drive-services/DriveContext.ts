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
}
