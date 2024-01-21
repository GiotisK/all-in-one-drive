import { OAuth2Client } from 'googleapis-common';
import { IDriveStrategy } from './IDriveStrategy';
import { drive, auth, drive_v3 } from '@googleapis/drive';
import { bytesToGigabytes } from '../../helpers/helpers';
import { DriveQuota, Nullable } from '../../types/global.types';

type Credentials = typeof auth.OAuth2.prototype.credentials;

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
		return this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
	}

	public async generateOAuth2token(authCode: string): Promise<string> {
		try {
			const tokenData = (await this.oAuth2Client.getToken(authCode)).tokens;

			return JSON.stringify(tokenData);
		} catch (err) {
			return '';
		}
	}

	public async getUserDriveEmail(token: string): Promise<string> {
		try {
			this.setToken(token);
			const res = await this.drive.about.get({ fields: 'user' });
			const email = res.data.user?.emailAddress;

			return email ?? '';
		} catch (err) {
			return '';
		}
	}

	public async getDriveQuota(token: string): Promise<Nullable<DriveQuota>> {
		try {
			this.setToken(token);
			const res = await this.drive.about.get({ fields: 'storageQuota' });
			const quota = res.data.storageQuota;

			if (quota?.limit && quota?.usage) {
				const totalSpaceInGb: string = bytesToGigabytes(quota.limit);
				const usedSpaceInGb: string = bytesToGigabytes(quota.usage);

				return {
					used: usedSpaceInGb,
					total: totalSpaceInGb,
				};
			}

			return null;
		} catch {
			return null;
		}
	}

	private setToken(tokenStr: string) {
		const token: Credentials = JSON.parse(tokenStr);
		this.oAuth2Client.setCredentials(token);
	}
}
