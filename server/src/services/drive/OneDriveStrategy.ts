import { drive } from '@googleapis/drive';
import { oneDriveLogger } from '../../logger/logger';
import {
	Nullable,
	DriveQuota,
	FileEntity,
	FileType,
	WatchChangesChannel,
	DriveChanges,
} from '../../types/global.types';
import { IDriveStrategy } from './IDriveStrategy';
import { bytesToGigabytes } from '../../helpers/helpers';

type Credentials = {
	client_id: string;
	client_secret: string;
	redirect_uri: string;
	scope: string;
};

export default class OneDriveStrategy implements IDriveStrategy {
	private redirectUri: string;
	private clientId: string;
	private clientSecret: string;
	private scope: string;

	constructor() {
		const credentials: Credentials = JSON.parse(process.env.ONEDRIVE_CREDENTIALS!);
		this.redirectUri = credentials.redirect_uri;
		this.clientId = credentials.client_id;
		this.clientSecret = credentials.client_secret;
		this.scope = credentials.scope;
	}

	public async getAuthLink(): Promise<Nullable<string>> {
		try {
			const res = await fetch(
				`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${this.clientId}&scope=${this.scope}&response_type=code&redirect_uri=${this.redirectUri}`
			);

			return res.url ?? null;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('getAuthLink', { error: err.message, stack: err.stack });
			}

			return null;
		}
	}

	public async generateOAuth2token(authCode: string, _driveId: string): Promise<string> {
		try {
			const res = await fetch('https://login.live.com/oauth20_token.srf', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `client_id=${this.clientId}&redirect_uri=${this.redirectUri}&client_secret=${this.clientSecret}&code=${authCode}&grant_type=authorization_code`,
			});

			const token: OneDriveToken = await res.json();

			return JSON.stringify(token);
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('generateOAuth2token', { error: err.message, stack: err.stack });
			}

			return '';
		}
	}

	public async getUserDriveEmail(token: string): Promise<string> {
		try {
			const accessToken = this.getAccessToken(token);
			const res = await fetch('https://graph.microsoft.com/v1.0/users/me', {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + accessToken,
					'Content-Type': 'application/json',
				},
			});

			const user = await res.json();

			return user.mail ?? '';
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('getUserDriveEmail', { error: err.message, stack: err.stack });
			}

			return '';
		}
	}

	public async getDriveQuota(token: string): Promise<Nullable<DriveQuota>> {
		try {
			const accessToken = this.getAccessToken(token);
			const res = await fetch('https://graph.microsoft.com/v1.0/users/me/drives', {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + accessToken,
					'Content-Type': 'application/json',
				},
			});

			const driveInfo = await res.json();

			if (driveInfo.value && driveInfo.value[0].quota) {
				return {
					total: bytesToGigabytes(driveInfo.value[0].quota.total),
					used: bytesToGigabytes(driveInfo.value[0].quota.used),
				};
			}

			return null;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('getDriveQuota', { error: err.message, stack: err.stack });
			}

			return null;
		}
	}

	getDriveFiles(
		token: string,
		driveId: string,
		folderId?: string
	): Promise<Nullable<FileEntity[]>> {
		throw new Error('Method not implemented.');
	}

	deleteFile(token: string, fileId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	renameFile(token: string, fileId: string, name: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	shareFile(token: string, fileId: string): Promise<Nullable<string>> {
		throw new Error('Method not implemented.');
	}

	unshareFile(token: string, fileId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	createFile(
		token: string,
		fileType: FileType,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		throw new Error('Method not implemented.');
	}

	downloadFile(token: string, fileId: string, driveId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	uploadFile(
		token: string,
		file: Express.Multer.File,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		throw new Error('Method not implemented.');
	}

	openFile(token: string, fileId: string): Promise<Nullable<string>> {
		throw new Error('Method not implemented.');
	}

	subscribeForChanges(token: string, driveId: string): Promise<WatchChangesChannel | null> {
		throw new Error('Method not implemented.');
	}

	unsubscribeForChanges(token: string, id: string, resourceId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	fetchDriveChanges(
		token: string,
		driveEmail: string,
		driveId: string
	): Promise<Nullable<DriveChanges>> {
		throw new Error('Method not implemented.');
	}

	private getAccessToken(token: string): string {
		const parsedToken = JSON.parse(token) as OneDriveToken;
		return parsedToken.access_token;
	}
}

type OneDriveToken = {
	token_type: string;
	expires_in: number;
	access_token: string;
	refresh_token: string;
	scope: string;
	user_id: string;
};
