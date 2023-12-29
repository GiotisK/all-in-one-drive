export interface IDriveStrategy {
	getAuthLink(): string;
	generateOAuth2token(authCode: string): Promise<string>;
	getUserDriveEmail(token: string): Promise<string>;
}
