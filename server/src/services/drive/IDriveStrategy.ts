import { DriveQuota } from './drive.types';

export interface IDriveStrategy {
	getAuthLink(): string;
	generateOAuth2token(authCode: string): Promise<string>;
	getUserDriveEmail(token: string): Promise<string>;
	getDriveQuota(token: string): Promise<DriveQuota | null>;
}
