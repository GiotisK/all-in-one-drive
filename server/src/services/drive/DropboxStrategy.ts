import { bytesToGigabytes } from '../../helpers/helpers';
import {
	Nullable,
	DriveQuota,
	FileEntity,
	FileType,
	WatchChangesChannel,
	DriveChanges,
} from '../../types/global.types';
import { IDriveStrategy } from './IDriveStrategy';
//@ts-ignore
import * as dropboxV2Api from 'dropbox-v2-api';

export default class DropboxStrategy implements IDriveStrategy {
	private dropbox: Dropbox;

	constructor() {
		const credentials = JSON.parse(process.env.DROPBOX_CREDENTIALS!);
		this.dropbox = dropboxV2Api.authenticate({
			client_id: credentials.client_id,
			client_secret: credentials.client_secret,
			redirect_uri: credentials.redirect_uri,
		});
	}

	public getAuthLink(): Nullable<string> {
		return this.dropbox.generateAuthUrl() ?? null;
	}

	public async generateOAuth2token(authCode: string): Promise<string> {
		return new Promise(resolve => {
			this.dropbox.getToken(authCode, (err, result) => {
				resolve(err ? '' : result.access_token);
			});
		});
	}
	getUserDriveEmail(token: string): Promise<string> {
		return new Promise(resolve => {
			this.setToken(token);
			this.dropbox(
				{
					resource: 'users/get_current_account',
				},
				(err, result, _response) => {
					resolve(err ? '' : result.email);
				}
			);
		});
	}
	getDriveQuota(token: string): Promise<Nullable<DriveQuota>> {
		return new Promise(resolve => {
			this.setToken(token);
			this.dropbox(
				{
					resource: 'users/get_space_usage',
				},
				(err, result, _response) => {
					if (err) {
						resolve(null);
					} else {
						const totalSpaceInGb: string = bytesToGigabytes(
							'' + result.allocation.allocated
						);
						const usedSpaceInGb: string = bytesToGigabytes('' + result.used);

						resolve({ total: totalSpaceInGb, used: usedSpaceInGb });
					}
				}
			);
		});
	}
	getDriveFiles(
		token: string,
		dbEntityDriveId: string,
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
		dbEntityDriveId: string,
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

	private setToken(token: string) {
		this.dropbox = dropboxV2Api.authenticate({
			token,
		});
	}
}

// Self defined types since dropbox-v2-api doesn't provide ts support
type Dropbox = {
	authenticate: (options: {
		client_id: string;
		client_secret: string;
		redirect_uri: string;
	}) => Promise<string>;
	generateAuthUrl: () => string;
	getToken: (
		code: string,
		callback: (err: any, result: { access_token: string }) => void
	) => void;
} & {
	// Extending Dropbox to also be callable as a function
	(
		options: { resource: string },
		callback: (
			err: any,
			result: { email: string; used: number; allocation: { allocated: number } },
			response?: any
		) => void
	): void;
};
