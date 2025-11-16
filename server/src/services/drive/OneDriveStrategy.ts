import { oneDriveLogger } from '../../logger/logger';
import {
	Nullable,
	FileEntity,
	FileType,
	WatchChangesChannel,
	DriveChanges,
	DriveType,
	Status,
} from '../../types/global.types';
import { IDriveStrategy } from './IDriveStrategy';
import { normalizeBytes } from '../../helpers/helpers';
import DatabaseService from '../database/DatabaseFactory';
import EncryptionService from '../encryption/encryption.service';
import FileProgressHelper from './helpers/FileProgressHelper';
import FilesystemService from '../filesystem/filesystem.service';
import fsPromises from 'fs/promises';
import { Readable } from 'stream';
import axios from 'axios';
import { DriveQuotaBytes, ThumbnailsMap } from '../../types/types';
import { VirtualDriveFolderName } from '../constants';

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

	public async getOrCreateVirtualDriveFolder(
		token: string,
		driveId: string
	): Promise<Nullable<string>> {
		try {
			const accessToken = await this.getAccessToken(token);

			const res = await fetch(
				`https://graph.microsoft.com/v1.0/users/me/drive/root:/${VirtualDriveFolderName}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (res.ok) {
				const file: OneDriveFile = await res.json();
				oneDriveLogger('getOrCreateVirtualDriveFolder: already exists', { file }, 'info');

				return file.id;
			} else {
				oneDriveLogger(
					'getOrCreateVirtualDriveFolder: Creating virtual drive folder',
					undefined,
					'info'
				);

				const virtualDriveFolder = await this.createFile(
					token,
					FileType.Folder,
					driveId,
					undefined,
					VirtualDriveFolderName
				);

				if (virtualDriveFolder) {
					return virtualDriveFolder.id;
				}
			}

			return null;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('getAuthLink', { error: err.message, stack: err.stack });
			}

			return null;
		}
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

	public async generateOAuth2token(authCode: string, driveId: string): Promise<string> {
		try {
			const res = await fetch('https://login.live.com/oauth20_token.srf', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `client_id=${this.clientId}&redirect_uri=${this.redirectUri}&client_secret=${this.clientSecret}&code=${authCode}&grant_type=authorization_code`,
			});

			const token: OneDriveToken = await res.json();

			const extendedOneDriveToken = this.getExtendedOneDriveToken(token, driveId);

			return JSON.stringify(extendedOneDriveToken);
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('generateOAuth2token', { error: err.message, stack: err.stack });
			}

			return '';
		}
	}

	public async getUserDriveEmail(token: string): Promise<string> {
		try {
			const accessToken = await this.getAccessToken(token);
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

	public async getDriveQuota(token: string): Promise<Nullable<DriveQuotaBytes>> {
		try {
			const accessToken = await this.getAccessToken(token);
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
					total: driveInfo.value[0].quota.total,
					used: driveInfo.value[0].quota.used,
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

	public async getDriveFiles(
		token: string,
		driveId: string,
		folderId?: string
	): Promise<Nullable<FileEntity[]>> {
		try {
			const accessToken = await this.getAccessToken(token);
			const baseUrl = 'https://graph.microsoft.com/v1.0/users/me/drive';
			const filesSuffix = folderId
				? `/items/${folderId}/children?$expand=thumbnails`
				: '/root/children?$expand=thumbnails';
			const url = `${baseUrl}${filesSuffix}`;

			const res = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + accessToken,
					'Content-Type': 'application/json',
				},
			});

			const filesData = await res.json();

			if (filesData.value.length === 0) return [];

			const fileIds = filesData.value.map((file: OneDriveFile) => file.id);

			const driveEmail = await this.getUserDriveEmail(token);

			const sharedLinks = await this.getSharedLinks(accessToken, fileIds);

			const thumbNails = this.getThumbnails(filesData.value);

			const files = this.mapToUniversalFileEntityFormat(
				filesData.value,
				thumbNails,
				driveEmail,
				driveId,
				sharedLinks
			);
			return files;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('getDriveFiles', { error: err.message, stack: err.stack });
			}
			return null;
		}
	}

	public async deleteFile(token: string, fileId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken(token);
			const res = await fetch(
				'https://graph.microsoft.com/v1.0/users/me/drive/items/' + fileId,
				{
					method: 'DELETE',
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
				}
			);

			return res.ok;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('deleteFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async renameFile(token: string, fileId: string, name: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken(token);

			const res = await fetch(
				'https://graph.microsoft.com/v1.0/users/me/drive/items/' + fileId,
				{
					method: 'PATCH',
					headers: {
						Authorization: 'Bearer ' + accessToken,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name }),
				}
			);

			return res.ok;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('renameFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async unshareFile(token: string, fileId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken(token);

			const getPermissionRes = await fetch(
				`https://graph.microsoft.com/v1.0/users/me/drive/items/${fileId}/permissions`,
				{
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
				}
			);

			if (!getPermissionRes.ok) return false;

			const permissionData: PermissionData = await getPermissionRes.json();

			const permission = permissionData.value.find(p => p.link?.scope === 'anonymous');

			if (!permission) return false;

			const deletePermissionRes = await fetch(
				`https://graph.microsoft.com/v1.0/users/me/drive/items/${fileId}/permissions/${permission.id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
				}
			);

			return deletePermissionRes.ok;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('shareFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async shareFile(token: string, fileId: string): Promise<Nullable<string>> {
		try {
			const accessToken = await this.getAccessToken(token);

			const res = await fetch(
				'https://graph.microsoft.com/v1.0/users/me/drive/items/' + fileId + '/createLink',
				{
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + accessToken,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						type: 'view',
						scope: 'anonymous',
					}),
				}
			);

			if (!res.ok) return null;

			const linkData: LinkData = await res.json();
			const url = linkData.link?.webUrl;

			return url ?? null;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('shareFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async createFile(
		token: string,
		fileType: FileType,
		driveId: string,
		parentFolderId?: string,
		givenPath?: string
	): Promise<Nullable<FileEntity>> {
		try {
			const accessToken = await this.getAccessToken(token);
			let path = givenPath ?? '/New Folder';
			let url = '';
			if (parentFolderId) {
				url =
					'https://graph.microsoft.com/v1.0/users/me/drive/items/' +
					parentFolderId +
					'/children';
			} else {
				url = 'https://graph.microsoft.com/v1.0/users/me/drive/root/children';
			}

			const payload =
				fileType === 'folder'
					? {
							name: path,
							folder: {},
							'@microsoft.graph.conflictBehavior': 'rename',
					  }
					: {
							name: 'NewFile.txt',
							file: {},
							'@microsoft.graph.conflictBehavior': 'rename',
					  };

			const res = await fetch(url, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				oneDriveLogger('createFile', {
					error: res.statusText,
				});
			}

			const data: OneDriveFile = await res.json();

			const driveEmail = await this.getUserDriveEmail(token);

			const fileEntities = this.mapToUniversalFileEntityFormat(
				[data],
				{},
				driveEmail,
				driveId,
				{}
			);

			return fileEntities.length > 0 ? fileEntities[0] : null;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('createFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async downloadFile(token: string, fileId: string, driveId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken(token);
			const metadata = await this.getFileMetadata(accessToken, fileId);

			if (!metadata) {
				oneDriveLogger('downloadFile', {
					error: 'File metadatanot found',
				});

				return false;
			}

			if (metadata.folder) {
				oneDriveLogger('downloadFile', {
					error: 'Cannot download a folder',
				});

				return false;
			}
			const readable = await this.downloadFileInternal(accessToken, fileId);

			if (!readable) {
				return false;
			}

			FileProgressHelper.sendFileProgressEvent(readable, 'download', {
				driveId,
				fileId,
				name: metadata.name,
				size: metadata.size,
			});

			FilesystemService.saveFileToDownloads(readable, metadata.name);

			return true;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('downloadFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	private async createUploadSession(
		accessToken: string,
		fileName: string,
		parentFolderId?: string
	): Promise<string> {
		const url = parentFolderId
			? `https://graph.microsoft.com/v1.0/me/drive/items/${parentFolderId}:/${fileName}:/createUploadSession`
			: `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/createUploadSession`;

		const response = await axios.post(
			url,
			{
				item: {
					'@microsoft.graph.conflictBehavior': 'rename',
					name: fileName,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return response.data.uploadUrl;
	}

	public async uploadFile(
		token: string,
		file: Express.Multer.File,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		const { path, size, originalname } = file;
		const fileHandle = await fsPromises.open(path, 'r');
		let fileEntities: FileEntity[] = [];

		try {
			const accessToken = await this.getAccessToken(token);

			const uploadUrl = await this.createUploadSession(
				accessToken,
				originalname,
				parentFolderId
			);

			let start = 0;

			while (start < size) {
				const end = Math.min(start + 327680, size);
				const { bytesRead, buffer } = await fileHandle.read({
					buffer: Buffer.alloc(end - start),
					offset: 0,
					length: end - start,
					position: start,
				});

				const headers = {
					'Content-Length': bytesRead.toString(),
					'Content-Range': `bytes ${start}-${end - 1}/${size}`,
				};

				const res = await fetch(uploadUrl, {
					method: 'PUT',
					headers,
					body: buffer,
				});

				if (!res.ok) {
					oneDriveLogger('uploadFile', {
						error: res.statusText,
					});

					throw new Error(res.statusText);
				}

				const percent = Math.floor((end / size) * 100);

				FileProgressHelper.sendSimpleFileProgressUploadEvent({
					name: originalname,
					fileId: '',
					driveId,
					percentage: percent,
				});

				start = end;

				if (res.status === Status.CREATED) {
					const data: OneDriveFile = await res.json();
					const driveEmail = await this.getUserDriveEmail(token);
					fileEntities = this.mapToUniversalFileEntityFormat(
						[data],
						{},
						driveEmail,
						driveId,
						{}
					);
				}
			}
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('uploadFile', {
					error: err.message,
					stack: err.stack,
				});
			}
		} finally {
			await fileHandle.close();

			return fileEntities.length > 0 ? fileEntities[0] : null;
		}
	}

	public async openFile(token: string, fileId: string): Promise<Nullable<string>> {
		try {
			const accessToken = await this.getAccessToken(token);

			const metadata = await this.getFileMetadata(accessToken, fileId);

			if (!metadata) {
				oneDriveLogger('openFile', {
					error: 'File metadata not found',
				});

				return null;
			}

			const readable = await this.downloadFileInternal(accessToken, fileId);

			if (!readable) {
				return null;
			}

			const path = await FilesystemService.saveFileToTemp(readable, metadata.name);

			return path;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('openFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
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

	private getThumbnails(files: OneDriveFile[]): ThumbnailsMap {
		const thumbNailsMap: ThumbnailsMap = {};

		files.forEach((file: OneDriveFile) => {
			const extension = this.extractExtension(file.name);
			const url = file.thumbnails?.[0]?.small?.url;

			if (url && !this.isAudioFile(extension)) {
				thumbNailsMap[file.id] = url;
			}
		});

		return thumbNailsMap;
	}

	private async getAccessToken(token: string): Promise<string> {
		const oldParsedToken = JSON.parse(token) as ExtendedOneDriveToken;

		if (oldParsedToken.expires_in < Date.now()) {
			oneDriveLogger('getAccessToken: Onedrive token expired', undefined, 'info');

			const newToken = await this.refreshToken(oldParsedToken);

			return newToken ? newToken.access_token : oldParsedToken.access_token;
		}

		return oldParsedToken.access_token;
	}

	private mapToUniversalFileEntityFormat(
		files: OneDriveFile[],
		imgs: ThumbnailsMap,
		driveEmail: string,
		driveId: string,
		sharedLinksMap: Nullable<SharedLinksMap>
	): FileEntity[] {
		const fileEntities: FileEntity[] = files.map(file => {
			const fileName = file.name;
			const fileType = file.folder ? FileType.Folder : FileType.File;
			const size = fileType === FileType.File ? normalizeBytes('' + file.size) : '';
			const normalizedDate = file.createdDateTime?.substring(0, 10) ?? '';
			const extension =
				fileType === FileType.File ? this.extractExtension(fileName ?? '') : '-';
			const sharedLink = sharedLinksMap?.[file.id] ?? null;
			const sizeBytes = file.size ?? 0;
			const thumbnail = imgs[file.id] ?? null;

			return {
				id: file.id ?? '',
				name: file.name ?? '-',
				drive: DriveType.OneDrive,
				driveId: driveId,
				email: driveEmail,
				type: fileType,
				size: size,
				date: normalizedDate,
				extension: extension,
				sharedLink,
				sizeBytes,
				thumbnail,
			};
		});

		return fileEntities;
	}

	private async getSharedLinks(
		accessToken: string,
		fileIds: string[]
	): Promise<Nullable<SharedLinksMap>> {
		try {
			const idToFileId: Record<string, string> = {};

			const batchRequests = fileIds.map((id, index) => {
				const requestId = (index + 1).toString();
				idToFileId[requestId] = id;

				return {
					id: requestId,
					method: 'GET',
					url: `/me/drive/items/${id}/permissions`,
				};
			});

			const response = await fetch('https://graph.microsoft.com/v1.0/$batch', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ requests: batchRequests }),
			});

			const data: GraphBatchResponse = await response.json();
			const links = data.responses.map((res, i: number) => {
				if (res.status === Status.OK) {
					const publicLink = res.body.value.find(
						p => p.link && !p.inheritedFrom && p.link.scope === 'anonymous'
					);
					const fileId = idToFileId[res.id];

					return {
						fileId,
						publicLink: publicLink?.link?.webUrl || null,
					};
				} else {
					return {
						fileId: fileIds[i],
						error: `Failed with status ${res.status}`,
					};
				}
			});

			const sharedLinks: SharedLinksMap = {};

			links.forEach(link => {
				if (link.publicLink) {
					sharedLinks[link.fileId] = link.publicLink;
				}
			});

			return sharedLinks;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('getSharedLinks', { error: err.message, stack: err.stack });
			}
			return null;
		}
	}

	private async refreshToken(
		oldToken: ExtendedOneDriveToken
	): Promise<Nullable<ExtendedOneDriveToken>> {
		try {
			const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

			const params = new URLSearchParams();
			params.append('client_id', this.clientId);
			params.append('client_secret', this.clientSecret);
			params.append('refresh_token', oldToken.refresh_token);
			params.append('grant_type', 'refresh_token');
			params.append('redirect_uri', this.redirectUri);

			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: params,
			});

			const newToken: OneDriveToken = await res.json();

			if (res.ok) {
				const extendedOneDriveToken = this.getExtendedOneDriveToken(
					newToken,
					oldToken.driveId
				);

				const encryptedTokenData = EncryptionService.encrypt(
					JSON.stringify(extendedOneDriveToken)
				);

				DatabaseService.updateToken(oldToken.driveId, encryptedTokenData);

				return extendedOneDriveToken;
			} else {
				oneDriveLogger('refreshToken: Failed to refresh token');
				return null;
			}
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('refreshToken', { error: err.message, stack: err.stack });
			}
			return null;
		}
	}

	private getExtendedOneDriveToken(token: OneDriveToken, driveId: string): ExtendedOneDriveToken {
		return { ...token, driveId, expires_in: Date.now() + token.expires_in * 1000 };
	}

	private async getFileMetadata(token: string, fileId: string): Promise<Nullable<OneDriveFile>> {
		try {
			const response = await fetch(
				`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) return null;

			const data: OneDriveFile = await response.json();

			return data;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('getFileMetadata', { error: err.message, stack: err.stack });
			}
			return null;
		}
	}

	private async downloadFileInternal(
		accessToken: string,
		fileId: string
	): Promise<Nullable<Readable>> {
		try {
			const res = await fetch(
				'https://graph.microsoft.com/v1.0/users/me/drive/items/' + fileId + '/content',
				{
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
				}
			);

			const readableStream = res.body;

			if (!readableStream) {
				return null;
			}

			const nodeReadable = FilesystemService.toNodeReadable(res.body);

			return nodeReadable;
		} catch (err) {
			if (err instanceof Error) {
				oneDriveLogger('downloadFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	private isAudioFile(extension: string): boolean {
		return ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'oga', 'wma', 'aiff', 'alac'].includes(
			extension.toLowerCase()
		);
	}

	private extractExtension(fileName: string): string {
		return fileName.substring(fileName.lastIndexOf('.') + 1);
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

type ExtendedOneDriveToken = OneDriveToken & { driveId: string };

type OneDriveFile = {
	'@microsoft.graph.downloadUrl': string;
	id: string;
	name: string;
	size: number;
	file: boolean;
	createdDateTime: string;
	lastModifiedDateTime: string;
	folder: unknown;
	thumbnails?: [{ small?: { url: string } }];
};

type SharedLinksMap = Record<string, string>;
type GraphBatchResponse = {
	responses: Array<{
		'@odata.context': string;
		id: string;
		status: number;
		headers: Record<string, string>;
		body: {
			value: Array<{ inheritedFrom?: unknown; link?: { webUrl: string; scope: string } }>;
		};
	}>;
};

type LinkData = {
	link?: {
		webUrl: string;
		scope: string;
	};
};

type PermissionData = {
	value: Array<{
		id: string;
		link?: {
			type: string;
			scope: string;
			webUrl: string;
		};
	}>;
};
