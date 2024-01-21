import { FileEntity, DriveQuota, Nullable } from '../../types/global.types';

export interface IDriveStrategy {
	getAuthLink(): string;
	generateOAuth2token(authCode: string): Promise<string>;
	getUserDriveEmail(token: string): Promise<string>;
	getDriveQuota(token: string): Promise<Nullable<DriveQuota>>;
	getDriveFiles(token: string, folderId?: string): Promise<Nullable<FileEntity[]>>;
}
