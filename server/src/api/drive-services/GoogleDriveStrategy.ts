import { OAuth2Client } from 'googleapis-common';
import { IDriveStrategy } from './IDriveStrategy';
import { drive, auth, drive_v3 } from '@googleapis/drive';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export default class GoogleDriveStrategy implements IDriveStrategy {
	private drive: drive_v3.Drive;
	private oAuth2Client: OAuth2Client;

	constructor() {
		const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS!);
		const { client_secret, client_id, redirect_uris } = credentials.installed;

		this.oAuth2Client = new auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		this.drive = drive({ version: 'v3', auth: this.oAuth2Client });
	}

	public getAuthLink(): string {
		const authUrl = this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});

		return authUrl;
	}
}
