import { bytesToGigabytes, normalizeBytes } from '../../helpers/helpers';
import {
	Nullable,
	DriveQuota,
	FileEntity,
	FileType,
	WatchChangesChannel,
	DriveChanges,
	DriveType,
} from '../../types/global.types';
import DatabaseService from '../database/DatabaseFactory';
import EncryptionService from '../encryption/encryption.service';
import { IDriveStrategy } from './IDriveStrategy';
//@ts-ignore -- no types for dropbox
import * as dropboxV2Api from 'dropbox-v2-api';

export default class DropboxStrategy implements IDriveStrategy {
	private dropbox: Dropbox;

	constructor() {
		const credentials = JSON.parse(process.env.DROPBOX_CREDENTIALS!);
		this.dropbox = dropboxV2Api.authenticate({
			client_id: credentials.client_id,
			client_secret: credentials.client_secret,
			redirect_uri: credentials.redirect_uri,
			token_access_type: 'offline',
		});
	}

	public getAuthLink(): Nullable<string> {
		return this.dropbox.generateAuthUrl() ?? null;
	}

	public async generateOAuth2token(authCode: string, driveId: string): Promise<string> {
		return new Promise(resolve => {
			this.dropbox.getToken(authCode, (err, result) => {
				const { access_token, expires_in, refresh_token } = result;
				const tokenDataStr = this.createDropboxToken(
					access_token,
					expires_in,
					refresh_token,
					driveId
				);
				resolve(err ? '' : tokenDataStr);
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
		driveId: string,
		folderId?: string
	): Promise<Nullable<FileEntity[]>> {
		return new Promise(resolve => {
			this.setToken(token);

			this.dropbox(
				{
					resource: 'files/list_folder',
					parameters: {
						path: folderId ?? '',
						recursive: false,
						include_deleted: false,
						include_has_explicit_shared_members: false,
						include_mounted_folders: true,
						include_non_downloadable_files: true,
						limit: 2000,
					},
				},
				async (err, result, response) => {
					if (err) {
						resolve(null);
					}

					const driveEmail = await this.getUserDriveEmail(token);

					const filesEntities = this.mapToUniversalFileEntityFormat(
						result.entries,
						driveEmail,
						driveId
					);

					resolve(filesEntities);
				}
			);
		});
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

	private async setToken(tokenStr: string) {
		try {
			const tokenData: DropboxToken = JSON.parse(tokenStr);

			if (!isDropboxToken(tokenData)) {
				console.log('[DropboxStrategy]: Not valid dropbox token format', tokenData);
				return;
			}

			const { access_token, refresh_token, expirationDateIso, driveId } = tokenData;

			const tokenHasExpired = new Date() > new Date(expirationDateIso);

			let newToken: Nullable<string> = null;
			if (tokenHasExpired) {
				newToken = await this.refreshToken(refresh_token, driveId);

				if (newToken) {
					//todo: think this, how to avoid using other services here
					const encryptedTokenData = EncryptionService.encrypt(newToken);
					DatabaseService.updateToken(driveId, encryptedTokenData);
				} else {
					console.log(
						'[DropboxStrategy]: Did not manage to refresh token, aborting setToken'
					);
					return;
				}
			}

			this.dropbox = dropboxV2Api.authenticate({
				token: newToken ?? access_token,
			});
		} catch (err) {
			console.error(err);
		}
	}

	private refreshToken(refreshToken: string, driveId: string): Promise<Nullable<string>> {
		return new Promise(resolve => {
			this.dropbox.refreshToken(refreshToken, (err, result, response) => {
				if (err) {
					//todo: add winston for error logs
					console.log('[DropboxStrategy]: Error refreshing token', err);
					resolve(null);
				}

				const tokenDataStr = this.createDropboxToken(
					result.access_token,
					result.expires_in,
					refreshToken,
					driveId
				);
				resolve(tokenDataStr);
			});
		});
	}

	private createDropboxToken(
		accessToken: string,
		expiresIn: number,
		refreshToken: string,
		driveId: string
	): string {
		const currentDate = new Date();
		const expirationDate = new Date(currentDate.getTime() + expiresIn * 1000);
		const expirationDateInIsoFormat = expirationDate.toISOString();

		const tokenData: DropboxToken = {
			access_token: accessToken,
			refresh_token: refreshToken,
			expirationDateIso: expirationDateInIsoFormat,
			driveId,
		};

		return JSON.stringify(tokenData);
	}

	private mapToUniversalFileEntityFormat(
		files: DropboxFile[],
		driveEmail: string,
		driveId: string
	): FileEntity[] {
		const fileEntities: FileEntity[] = files.map(file => {
			const fileName = file.name;
			const fileType = file['.tag'] === 'folder' ? FileType.Folder : FileType.File;
			const size = fileType === FileType.File ? normalizeBytes('' + file.size) : '';
			const normalizedDate = file.client_modified?.substring(0, 10) ?? '-';
			const extension =
				fileType === FileType.File ? fileName.substring(fileName.lastIndexOf('.')) : '-';

			//todo: add shared link info
			const isPubliclyShared = false; //todo: fix
			const sharedLink = /* isPubliclyShared && file.webViewLink ? file.webViewLink : */ null;
			const sizeBytes = file.size ?? 0;

			return {
				id: file.id ?? '',
				name: file.name ?? '-',
				drive: DriveType.Dropbox,
				driveId: driveId,
				email: driveEmail,
				type: fileType,
				size: size,
				date: normalizedDate,
				extension: extension,
				sharedLink,
				sizeBytes,
			};
		});

		return fileEntities;
	}
}

// Self defined types since dropbox-v2-api doesn't provide ts support
type DropboxFile = {
	'.tag': 'folder' | 'file';
	id: string;
	name: string;
	path_lower: string;
	client_modified?: string;
	size?: number;
};
type Dropbox = {
	authenticate: (options: {
		client_id: string;
		client_secret: string;
		redirect_uri: string;
	}) => Promise<string>;
	generateAuthUrl: () => string;
	getToken: (
		code: string,
		callback: (
			err: any,
			result: { access_token: string; refresh_token: string; expires_in: number }
		) => void
	) => void;
	refreshToken: (
		token: string,
		callback: (
			err: any,
			result: { access_token: string; expires_in: number },
			response: any
		) => void
	) => void;
} & {
	(
		options: { resource: string; parameters?: {} },
		callback: (
			err: any,
			result: {
				entries: DropboxFile[];
				email: string;
				used: number;
				allocation: { allocated: number };
			},
			response?: any
		) => void
	): void;
};

type DropboxToken = {
	access_token: string;
	refresh_token: string;
	expirationDateIso: string;
	driveId: string;
};

const isDropboxToken = (token: unknown): token is DropboxToken => {
	return (
		typeof token === 'object' &&
		token !== null &&
		'access_token' in token &&
		'refresh_token' in token &&
		'expirationDateIso' in token &&
		'driveId' in token
	);
};
