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
import FilesystemService from '../filesystem/filesystem.service';
import FileProgressHelper from './helpers/FileProgressHelper';
import fs from 'fs';
import { dropboxLogger } from '../../logger/logger';

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
		const authCode = this.dropbox.generateAuthUrl();

		if (authCode) {
			return authCode;
		} else {
			dropboxLogger('getAuthLink: Error generating auth link');
			return null;
		}
	}

	public async generateOAuth2token(authCode: string, driveId: string): Promise<string> {
		return new Promise(resolve => {
			this.dropbox.getToken(authCode, (err, result) => {
				const { access_token, expires_in, refresh_token } = result;
				const tokenData = this.createDropboxToken(
					access_token,
					expires_in,
					refresh_token,
					driveId
				);

				if (err) {
					dropboxLogger('generateOAuth2token', err);
					resolve('');
				} else {
					resolve(JSON.stringify(tokenData));
				}
			});
		});
	}

	getUserDriveEmail(token: string): Promise<string> {
		return new Promise(async resolve => {
			await this.setToken(token);

			this.dropbox<AccountResult>(
				{
					resource: 'users/get_current_account',
				},
				(err, result, _response) => {
					if (err) {
						dropboxLogger('getUserDriveEmail', err);
						resolve('');
					} else {
						resolve(result.email);
					}
				}
			);
		});
	}

	getDriveQuota(token: string): Promise<Nullable<DriveQuota>> {
		return new Promise(async resolve => {
			await this.setToken(token);

			this.dropbox<AllocationResult>(
				{
					resource: 'users/get_space_usage',
				},
				(err, result, _response) => {
					if (err) {
						dropboxLogger('getDriveQuota', err);
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
		return new Promise(async resolve => {
			await this.setToken(token);

			this.dropbox<ListFilesResult>(
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
				async (err, result) => {
					if (err) {
						dropboxLogger('getDriveFiles', err);
						resolve(null);
					}

					const driveEmail = await this.getUserDriveEmail(token);
					const sharedLinks = await this.getSharedLinks(token);

					const filesEntities = this.mapToUniversalFileEntityFormat(
						result.entries,
						driveEmail,
						driveId,
						sharedLinks ?? {}
					);

					resolve(filesEntities);
				}
			);
		});
	}

	deleteFile(token: string, fileId: string): Promise<boolean> {
		return new Promise(async resolve => {
			await this.setToken(token);

			this.dropbox(
				{
					resource: 'files/delete_v2',
					parameters: {
						path: fileId,
					},
				},
				err => {
					if (err) {
						dropboxLogger('deleteFile', err);
						resolve(false);
					} else {
						resolve(true);
					}
				}
			);
		});
	}

	renameFile(token: string, fileId: string, name: string): Promise<boolean> {
		return new Promise(async resolve => {
			await this.setToken(token);

			const res = await this.getFileMetadata(token, fileId);

			if (!res) {
				resolve(false);
				return;
			}

			const parentFolder = res.path_lower.substring(0, res.path_lower.lastIndexOf('/'));
			const newPath = `${parentFolder}/${name}`;

			this.dropbox(
				{
					resource: 'files/move_v2',
					parameters: {
						from_path: fileId,
						to_path: newPath,
					},
				},
				err => {
					if (err) {
						dropboxLogger('renameFile', err);
						resolve(false);
					} else {
						resolve(true);
					}
				}
			);
		});
	}

	shareFile(token: string, fileId: string): Promise<Nullable<string>> {
		return new Promise(async resolve => {
			await this.setToken(token);

			this.dropbox<ShareFileResult>(
				{
					resource: 'sharing/create_shared_link_with_settings',
					parameters: {
						path: fileId,
						settings: {
							requested_visibility: 'public',
							audience: 'public',
							access: 'viewer',
						},
					},
				},
				(err, result) => {
					if (err) {
						dropboxLogger('shareFile', err);
						resolve(null);
					} else {
						resolve(result.url);
					}
				}
			);
		});
	}

	unshareFile(token: string, fileId: string): Promise<boolean> {
		return new Promise(async resolve => {
			await this.setToken(token);

			const sharedLinks = await this.getSharedLinks(token, fileId);
			const sharedLink = sharedLinks?.[fileId];

			if (!sharedLink) {
				resolve(false);
				return;
			}

			this.dropbox(
				{
					resource: 'sharing/revoke_shared_link',
					parameters: {
						url: sharedLink,
					},
				},
				err => {
					if (err) {
						dropboxLogger('unshareFile', err);
						resolve(false);
					} else {
						resolve(true);
					}
				}
			);
		});
	}

	createFile(
		token: string,
		fileType: FileType,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		return new Promise(async resolve => {
			await this.setToken(token);

			if (fileType === FileType.File) {
				dropboxLogger('createFile: Dropbox does not support file creation');
				resolve(null);
				return;
			}

			let path = '/New Folder';

			if (parentFolderId) {
				const metadata = await this.getFileMetadata(token, parentFolderId);

				if (!metadata) {
					resolve(null);
					return;
				}

				path = metadata.path_lower + path;
			}

			this.dropbox<CreateFolderResult>(
				{
					resource: 'files/create_folder',
					parameters: {
						path,
						autorename: true,
					},
				},
				async (err, result) => {
					if (err) {
						dropboxLogger('createFile', err);
						resolve(null);
						return;
					}

					const metadata = await this.getFileMetadata(token, result.id);
					const driveEmail = await this.getUserDriveEmail(token);

					if (!metadata) {
						resolve(null);
						return;
					}

					const fileEntities = this.mapToUniversalFileEntityFormat(
						[metadata],
						driveEmail,
						driveId,
						{}
					);

					if (fileEntities.length > 0) {
						resolve(fileEntities[0]);
					} else {
						dropboxLogger('createFile: Failed to create file. "fileEntities" is empty');
						resolve(null);
					}
				}
			);
		});
	}

	openFile(token: string, fileId: string): Promise<Nullable<string>> {
		return new Promise(async resolve => {
			const metadata = await this.getFileMetadata(token, fileId);

			if (!metadata) {
				resolve(null);
				return;
			}

			const { name } = metadata;

			const data: any = this.dropbox(
				{
					resource: 'files/download',
					parameters: {
						path: fileId,
					},
				},
				(err, _result, _response) => {
					if (err) {
						dropboxLogger('openFile', err);
						resolve(null);
						return;
					}
				}
			);

			if (data) {
				const path = await FilesystemService.saveFileToTemp(data, name);

				resolve(path);
				return;
			}

			dropboxLogger('openFile: Failed to open file. "data" is empty');
			resolve(null);
		});
	}

	downloadFile(token: string, fileId: string, driveId: string): Promise<boolean> {
		return new Promise(async resolve => {
			await this.setToken(token);

			const metadata = await this.getFileMetadata(token, fileId);

			if (!metadata) {
				resolve(false);
				return;
			}

			const { size = 0, name } = metadata;

			const data: any = this.dropbox(
				{
					resource: 'files/download',
					parameters: {
						path: fileId,
					},
				},
				(err, _result, _response) => {
					if (err) {
						dropboxLogger('downloadFile', err);
						resolve(false);
						return;
					}
				}
			);

			if (data) {
				FileProgressHelper.sendFileProgressEvent(data, 'download', {
					driveId,
					fileId,
					name,
					size,
				});

				FilesystemService.saveFileToDownloads(data, name);

				resolve(true);
				return;
			}

			dropboxLogger('downloadFile: Failed to download file. "data" is empty');
			resolve(false);
		});
	}

	uploadFile(
		token: string,
		file: Express.Multer.File,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		return new Promise(async resolve => {
			await this.setToken(token);

			let path = '/' + file.filename;
			const fileSize = fs.statSync(file.path).size;

			if (parentFolderId) {
				const metadata = await this.getFileMetadata(token, parentFolderId);

				if (!metadata) {
					resolve(null);
					return;
				}

				path = metadata.path_lower + path;
			}

			const data: any = this.dropbox<UploadResult>(
				{
					resource: 'files/upload',
					parameters: {
						path,
					},
				},
				err => {
					if (err) {
						dropboxLogger('uploadFile', err);
						resolve(null);
					}
				}
			);

			if (data) {
				FileProgressHelper.sendFileProgressEvent(data, 'upload', {
					driveId,
					fileId: '',
					name: file.originalname,
					size: fileSize,
				});
				fs.createReadStream(file.path).pipe(data);
			} else {
				dropboxLogger('uploadFile: Failed to upload file. "data" is empty');
			}
		});
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
		return new Promise<void>(async resolve => {
			try {
				const tokenData: DropboxToken = JSON.parse(tokenStr);

				if (!isDropboxToken(tokenData)) {
					dropboxLogger('setToken: Not valid dropbox token format', tokenData);
					return;
				}

				const { access_token, refresh_token, expirationDateIso, driveId } = tokenData;

				const tokenHasExpired = new Date() > new Date(expirationDateIso);

				let newToken: Nullable<DropboxToken> = null;
				if (tokenHasExpired) {
					dropboxLogger('setToken: Token has expired, refreshing', {}, 'info');
					newToken = await this.refreshToken(refresh_token, driveId);

					if (newToken) {
						const encryptedTokenData = EncryptionService.encrypt(
							JSON.stringify(newToken)
						);
						DatabaseService.updateToken(driveId, encryptedTokenData);
					} else {
						dropboxLogger('setToken: Failed to refresh token. New token is empty');
						resolve();
					}
				}

				this.dropbox = dropboxV2Api.authenticate({
					token: newToken?.access_token ?? access_token,
				});

				resolve();
			} catch (err) {
				dropboxLogger('setToken: Failed to set token', { error: err });
				resolve();
			}
		});
	}

	private refreshToken(refreshToken: string, driveId: string): Promise<Nullable<DropboxToken>> {
		return new Promise(resolve => {
			this.dropbox.refreshToken(refreshToken, (err, result, response) => {
				if (err) {
					dropboxLogger('refreshToken', err, 'error');
					resolve(null);
				}

				const tokenData = this.createDropboxToken(
					result.access_token,
					result.expires_in,
					refreshToken,
					driveId
				);
				resolve(tokenData);
			});
		});
	}

	private createDropboxToken(
		accessToken: string,
		expiresIn: number,
		refreshToken: string,
		driveId: string
	): DropboxToken {
		const currentDate = new Date();
		const expirationDate = new Date(currentDate.getTime() + expiresIn * 1000);
		const expirationDateInIsoFormat = expirationDate.toISOString();

		const tokenData: DropboxToken = {
			access_token: accessToken,
			refresh_token: refreshToken,
			expirationDateIso: expirationDateInIsoFormat,
			driveId,
		};

		return tokenData;
	}

	private mapToUniversalFileEntityFormat(
		files: DropboxFile[],
		driveEmail: string,
		driveId: string,
		sharedLinks: SharedLinksMap
	): FileEntity[] {
		const fileEntities: FileEntity[] = files.map(file => {
			const fileName = file.name;
			const fileType = file['.tag'] === 'folder' ? FileType.Folder : FileType.File;
			const size = fileType === FileType.File ? normalizeBytes('' + file.size) : '';
			const normalizedDate = file.client_modified?.substring(0, 10) ?? '';
			const extension =
				fileType === FileType.File
					? fileName.substring(fileName.lastIndexOf('.') + 1)
					: '-';

			const sharedLink = sharedLinks[file.id] ?? null;
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

	private getFileMetadata(token: string, fileId: string) {
		return new Promise<Nullable<DropboxFile>>(async resolve => {
			await this.setToken(token);

			this.dropbox<MetadataResult>(
				{
					resource: 'files/get_metadata',
					parameters: {
						path: fileId,
					},
				},
				(err, result) => {
					if (err) {
						dropboxLogger('getFileMetadata', err);
						resolve(null);
					} else {
						resolve(result);
					}
				}
			);
		});
	}

	private getSharedLinks(token: string, fileId?: string): Promise<Nullable<SharedLinksMap>> {
		return new Promise(async resolve => {
			await this.setToken(token);
			const parameters = fileId ? { path: fileId } : {};

			this.dropbox<SharedLinksResult>(
				{
					resource: 'sharing/list_shared_links',
					parameters,
				},
				(err, result) => {
					if (err) {
						dropboxLogger('getSharedLinks', err);
						resolve(null);
					} else {
						const sharedLinks: SharedLinksMap = {};

						result.links.forEach(link => {
							sharedLinks[link.id] = link.url;
						});

						resolve(sharedLinks);
					}
				}
			);
		});
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
	<T>(
		options: { resource: string; parameters?: {} },
		callback: (err: any, result: T, response?: any) => void
	): void;
};

type DropboxToken = {
	access_token: string;
	refresh_token: string;
	expirationDateIso: string;
	driveId: string;
};

type SharedLink = {
	id: string;
	url: string;
};

type SharedLinksMap = Record<string, string>;

type AllocationResult = { allocation: { allocated: number }; used: number };
type ListFilesResult = { entries: DropboxFile[] };
type AccountResult = { email: string };
type MetadataResult = DropboxFile;
type ShareFileResult = { url: string };
type SharedLinksResult = { links: SharedLink[] };
type CreateFolderResult = { id: string; name: string; path_lower: string; path_display: string };
type UploadResult = DropboxFile;

type DropboxError = {
	error_summary: string;
	error: object;
	code: number;
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
