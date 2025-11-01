import { OAuth2Client } from 'googleapis-common';
import { IDriveStrategy } from './IDriveStrategy';
import { drive, auth, drive_v3 } from '@googleapis/drive';
import { generateUUID, normalizeBytes } from '../../helpers/helpers';
import {
	ChangedFileEntity,
	DriveChanges,
	DriveType,
	FileEntity,
	FileType,
	Nullable,
	Status,
	WatchChangesChannel,
} from '../../types/global.types';
import { LOCALTUNNEL_URL } from '../../tunnel/subdomain';
import mime from 'mime';
import fs from 'fs';
import FilesystemService from '../filesystem/filesystem.service';
import FileProgressHelper from './helpers/FileProgressHelper';
import { googleDriveLogger } from '../../logger/logger';
import { DriveQuotaBytes } from '../../types/types';
import { VirtualDriveFolderName } from '../constants';

type Credentials = typeof auth.OAuth2.prototype.credentials;
type GoogleDriveFile = drive_v3.Schema$File;
type ParamsResourceChangesWatch = drive_v3.Params$Resource$Changes$Watch;

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const PUBLIC_SHARED_LINK_BASE_URL = 'https://drive.google.com/open?id=';
const PUBLIC_SHARED_PERMISSION_TYPE = 'anyone';

const WEBHOOK_EXPIRATION_TIME_IN_MS = 24 * 60 * 60 * 1000; // 24hours
const WEBHOOK_ENDPOINT = `${LOCALTUNNEL_URL}/drives/webhook`;

export default class GoogleDriveStrategy implements IDriveStrategy {
	private readonly drive: drive_v3.Drive;
	private readonly oAuth2Client: OAuth2Client;

	constructor() {
		const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS!);
		const { client_secret, client_id, redirect_uris } = credentials.installed;

		this.oAuth2Client = new auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		this.drive = drive({ version: 'v3', auth: this.oAuth2Client });
	}

	public async getOrCreateVirtualDriveFolder(
		token: string,
		driveId: string
	): Promise<Nullable<string>> {
		try {
			this.setToken(token);

			const res = await this.drive.files.list({
				q: `name = 'aio-drive' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
				pageSize: 1000,
				fields: 'files(id, size, name, mimeType, createdTime, webViewLink, permissions)',
			});

			const files = res.data.files;

			if (files && files.length) {
				const virtualDriveFolderId = files[0].id;

				if (virtualDriveFolderId) {
					googleDriveLogger(
						'getOrCreateVirtualDriveFolder: Virtual drive folder already exists ' +
							virtualDriveFolderId,
						undefined,
						'info'
					);
					return virtualDriveFolderId;
				}

				return null;
			}

			googleDriveLogger(
				'getOrCreateVirtualDriveFolder: Creating virtual drive folder',
				undefined,
				'info'
			);

			const file = await this.createFile(
				token,
				FileType.Folder,
				driveId,
				undefined,
				VirtualDriveFolderName
			);

			if (file) {
				return file.id;
			}

			return null;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('getOrCreateVirtualDriveFolder', {
					error: err.message,
					stack: err.stack,
				});
			}
			return null;
		}
	}

	public getAuthLink(): Promise<Nullable<string>> {
		return new Promise(resolve => {
			const authLink = this.oAuth2Client.generateAuthUrl({
				access_type: 'offline',
				scope: SCOPES,
			});

			if (authLink) {
				resolve(authLink);
				return;
			}

			googleDriveLogger('getAuthLink: Error generating auth link');
			resolve(null);
		});
	}

	public async generateOAuth2token(authCode: string, _driveId: string): Promise<string> {
		try {
			const tokenData = (await this.oAuth2Client.getToken(authCode)).tokens;

			return JSON.stringify(tokenData);
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('generateOAuth2token: Error generating auth link', {
					error: err.message,
					stack: err.stack,
				});
			}
			return '';
		}
	}

	public async getUserDriveEmail(token: string): Promise<string> {
		try {
			this.setToken(token);
			const res = await this.drive.about.get({ fields: 'user' });
			const email = res.data.user?.emailAddress;

			if (email) {
				return email;
			}

			googleDriveLogger('getUserDriveEmail: Error getting user drive email');

			return '';
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('getUserDriveEmail', {
					error: err.message,
					stack: err.stack,
				});
			}
			return '';
		}
	}

	public async getDriveQuota(token: string): Promise<Nullable<DriveQuotaBytes>> {
		try {
			this.setToken(token);
			const res = await this.drive.about.get({ fields: 'storageQuota' });
			const quota = res.data.storageQuota;

			if (quota?.limit && quota?.usage) {
				return {
					used: +quota.usage,
					total: +quota.limit,
				};
			}

			googleDriveLogger('getDriveQuota: Error getting drive quota');

			return null;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('getDriveQuota', {
					error: err.message,
					stack: err.stack,
				});
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
			this.setToken(token);
			const filesQuery = this.createFilesQuery(folderId);
			const res = await this.drive.files.list({
				q: filesQuery,
				pageSize: 1000,
				fields: 'files(id, size, name, mimeType, createdTime, webViewLink, permissions, thumbnailLink)',
			});
			const files = res.data.files;
			const driveEmail = await this.getUserDriveEmail(token);

			if (files) {
				return this.mapToUniversalFileEntityFormat(files, driveEmail, driveId);
			}

			googleDriveLogger('getDriveFiles: Error getting drive files. "files" is undefined');

			return null;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('getDriveFiles', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async deleteFile(token: string, fileId: string): Promise<boolean> {
		try {
			this.setToken(token);
			await this.drive.files.delete({ fileId });

			return true;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('deleteFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async renameFile(token: string, fileId: string, name: string): Promise<boolean> {
		try {
			this.setToken(token);
			await this.drive.files.update({
				fileId,
				requestBody: {
					name,
				},
			});

			return true;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('renameFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
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
			this.setToken(token);
			let path = givenPath ?? 'New Folder';
			const mimeType =
				fileType === FileType.Folder
					? 'application/vnd.google-apps.folder'
					: 'application/octet-stream';

			const res = await this.drive.files.create({
				requestBody: {
					name: path,
					mimeType,
					parents: parentFolderId ? [parentFolderId] : [],
				},
				fields: 'id, name, mimeType, createdTime',
			});

			const driveEmail = await this.getUserDriveEmail(token);

			return this.mapToUniversalFileEntityFormat([res.data], driveEmail, driveId)[0];
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('createFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async downloadFile(token: string, fileId: string, driveId: string): Promise<boolean> {
		try {
			this.setToken(token);

			const data = await this.downloadFileInternal(fileId, driveId, true);

			if (data) {
				FilesystemService.saveFileToDownloads(data.fileData, data.name);
				return true;
			}

			googleDriveLogger('downloadFile: Error downloading file. "data" is empty');

			return false;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('downloadFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async uploadFile(
		token: string,
		file: Express.Multer.File,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		try {
			this.setToken(token);

			const fileSize = fs.statSync(file.path).size;

			const fileStream = fs.createReadStream(file.path);

			FileProgressHelper.sendFileProgressEvent(fileStream, 'upload', {
				driveId,
				fileId: '',
				size: fileSize,
				name: file.originalname,
			});

			const res = await this.drive.files.create({
				media: {
					mimeType: file.mimetype,
					body: fileStream,
				},
				requestBody: {
					parents: parentFolderId ? [parentFolderId] : [],
				},
				fields: 'id',
			});

			const newFileId = res.data.id;

			if (newFileId) {
				const res = await this.drive.files.update({
					fileId: newFileId,
					requestBody: {
						name: file.originalname,
					},
					fields: 'id, size, name, mimeType, createdTime, webViewLink, permissions',
				});

				const driveEmail = await this.getUserDriveEmail(token);
				const fileEntities = this.mapToUniversalFileEntityFormat(
					[res.data],
					driveEmail,
					driveId
				);

				return fileEntities.length > 0 ? fileEntities[0] : null;
			}

			googleDriveLogger('uploadFile: "newFileId" is empty"');
			return null;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('uploadFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async openFile(token: string, fileId: string): Promise<Nullable<string>> {
		try {
			this.setToken(token);

			const data = await this.downloadFileInternal(fileId);

			if (data) {
				const path = await FilesystemService.saveFileToTemp(
					data.fileData,
					data.name,
					'',
					false
				);

				return path;
			}

			googleDriveLogger('openFile: "data" is empty');

			return null;
		} catch {
			return null;
		}
	}

	public async exportFile(token: string, fileId: string, mimeType: string): Promise<boolean> {
		try {
			this.setToken(token);

			const metadata = await this.getFileMetadata(fileId);

			if (!metadata) {
				return false;
			}

			const res = await this.drive.files.export(
				{ fileId, mimeType },
				{ responseType: 'stream' }
			);

			FilesystemService.saveFileToDownloads(
				res.data,
				metadata.name,
				mime.getExtension(mimeType) ?? ''
			);

			if (res.status === Status.OK) {
				return true;
			}

			googleDriveLogger('exportFile: failed to export file');
			return false;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('exportFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async shareFile(token: string, fileId: string): Promise<Nullable<string>> {
		try {
			this.setToken(token);
			await this.drive.permissions.create({
				fileId,
				requestBody: {
					role: 'reader',
					type: PUBLIC_SHARED_PERMISSION_TYPE,
				},
			});

			return PUBLIC_SHARED_LINK_BASE_URL + fileId;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('shareFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async unshareFile(token: string, fileId: string): Promise<boolean> {
		try {
			this.setToken(token);
			const res = await this.drive.permissions.list({
				fileId,
				fields: 'permissions(id, role, type)',
			});

			const publicSharedLinkPermission = res.data.permissions?.find(
				permission => permission.type === PUBLIC_SHARED_PERMISSION_TYPE
			);

			if (publicSharedLinkPermission && publicSharedLinkPermission.id) {
				await this.drive.permissions.delete({
					fileId,
					permissionId: publicSharedLinkPermission.id,
				});
				return true;
			}

			googleDriveLogger('unshareFile: "publicSharedLinkPermission" is undefined');

			return false;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('unshareFile', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async getExportFormats(token: string, fileId: string): Promise<Nullable<string[]>> {
		try {
			this.setToken(token);
			const res = await this.drive.files.get({
				fileId,
				fields: 'exportLinks',
			});

			return res.data.exportLinks ? Object.keys(res.data.exportLinks) : [];
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('getExportFormats', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async fetchDriveChanges(
		token: string,
		startPageToken: string,
		driveId: string
	): Promise<Nullable<DriveChanges>> {
		this.setToken(token);

		try {
			const {
				data: { changes = [], newStartPageToken },
			} = await this.drive.changes.list({
				pageToken: startPageToken,
				fields: 'newStartPageToken, changes(file(id, name, permissions, webViewLink), time, removed)',
			}); //todo: fix removed not working currently, it always returns false

			const results: ChangedFileEntity[] = [];

			changes.forEach(change => {
				if (change.file) {
					results.push({
						id: change.file.id!,
						removed: change.removed ?? false,
						name: change.file.name ?? '',
						date: change.time?.substring(0, 10) ?? '',
						sharedLink: this.isFilePubliclyShared(change.file)
							? change.file.webViewLink!
							: null,
						type: FileType.File,
						driveId,
					});
				}
			});

			return {
				changes: results,
				startPageToken: newStartPageToken!,
			};
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('fetchDriveChanges', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	public async unsubscribeForChanges(
		token: string,
		id: string,
		resourceId: string
	): Promise<boolean> {
		this.setToken(token);
		try {
			await this.drive.channels.stop({
				requestBody: {
					id,
					resourceId,
				},
			});

			googleDriveLogger(
				'unsubscribeForChanges: Stopped drive notifications for channel id: ' + id,
				{},
				'info'
			);

			return true;
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('unsubscribeForChanges', {
					error: err.message,
					stack: err.stack,
				});
			}

			return false;
		}
	}

	public async subscribeForChanges(
		token: string,
		driveId: string
	): Promise<WatchChangesChannel | null> {
		this.setToken(token);
		const watchChangesChannel = await this.registerForDriveChanges(driveId);
		return watchChangesChannel;
	}

	private async downloadFileInternal(
		fileId: string,
		driveId?: string,
		shouldSendProgress: boolean = false
	) {
		try {
			const metadata = await this.getFileMetadata(fileId);

			if (!metadata) {
				return false;
			}

			const res = await this.drive.files.get(
				{ fileId, alt: 'media' },
				{ responseType: 'stream' }
			);

			if (shouldSendProgress && driveId) {
				FileProgressHelper.sendFileProgressEvent(res.data, 'download', {
					driveId,
					fileId,
					size: metadata.size,
					name: metadata.name,
				});
			}

			return {
				fileData: res.data,
				name: metadata.name,
			};
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('downloadFileInternal', {
					error: err.message,
					stack: err.stack,
				});
			}
			return null;
		}
	}

	private async registerForDriveChanges(driveId: string): Promise<WatchChangesChannel | null> {
		try {
			const watchChangesRequest = await this.createChangesWatchRequest(
				generateUUID(),
				WEBHOOK_ENDPOINT,
				driveId
			);
			console.log(
				'[GoogleDriveStrategy::registerForDriveChanges]: sending watch request with endpoint',
				WEBHOOK_ENDPOINT
			);
			const response = await this.drive.changes.watch(watchChangesRequest);
			console.log(
				'[GoogleDriveStrategy::registerForDriveChanges]: registered for changes successfully'
			);

			return {
				id: response.data.id ?? '',
				resourceId: response.data.resourceId ?? '',
				startPageToken: watchChangesRequest.pageToken ?? '',
				driveId,
			};
		} catch (err) {
			if (err instanceof Error) {
				googleDriveLogger('registerForDriveChanges', {
					error: err.message,
					stack: err.stack,
				});
			}

			return null;
		}
	}

	private async createChangesWatchRequest(
		id: string,
		address: string,
		driveId: string
	): Promise<ParamsResourceChangesWatch> {
		const startPageToken = await this.getChangesStartPageToken();

		return {
			supportsAllDrives: true,
			includeRemoved: true,
			pageToken: startPageToken,
			requestBody: {
				id,
				type: 'web_hook',
				address,
				expiration: String(Date.now() + WEBHOOK_EXPIRATION_TIME_IN_MS),
				token: driveId,
			},
		};
	}

	private async getChangesStartPageToken(supportsAllDrives = true): Promise<string | undefined> {
		const {
			data: { startPageToken },
		} = await this.drive.changes.getStartPageToken({ supportsAllDrives });
		return startPageToken ?? undefined;
	}

	private setToken(tokenStr: string) {
		const token: Credentials = JSON.parse(tokenStr);
		this.oAuth2Client.setCredentials(token);
	}

	private createFilesQuery(folderId?: string): string {
		const rootFilesQuery = "'root' in parents and not trashed";
		const folderFilesQuery = `'${folderId}' in parents`;

		return folderId ? folderFilesQuery : rootFilesQuery;
	}

	private async getFileMetadata(fileId: string) {
		try {
			const metadataRes = await this.drive.files.get({
				fileId,
				fields: 'name, mimeType, size',
			});

			const size = parseInt(metadataRes.data.size ?? '0', 10);
			const name = metadataRes.data.name ?? 'file';
			const extension = mime.getExtension(metadataRes.data.mimeType ?? '');

			return { name, extension, size };
		} catch {
			return null;
		}
	}

	private mapToUniversalFileEntityFormat(
		files: GoogleDriveFile[],
		driveEmail: string,
		driveId: string
	): FileEntity[] {
		const driveEntities: FileEntity[] = files.map(file => {
			const fileType = this.determineEntityType(file.mimeType ?? '');
			const size = fileType === FileType.File ? normalizeBytes(file.size ?? '') : '';
			const normalizedDate = file.createdTime?.substring(0, 10) ?? '-';
			const extension = file.mimeType ? mime.getExtension(file.mimeType) : '-';
			const isPubliclyShared = this.isFilePubliclyShared(file);
			const sharedLink = isPubliclyShared && file.webViewLink ? file.webViewLink : null;
			const sizeBytes = parseInt(file.size ?? '0', 10);

			return {
				id: file.id ?? '',
				name: file.name ?? '-',
				drive: DriveType.GoogleDrive,
				driveId: driveId,
				email: driveEmail,
				type: fileType,
				size: size,
				date: normalizedDate,
				extension: extension || '-',
				sharedLink,
				sizeBytes,
			};
		});

		return driveEntities;
	}

	private determineEntityType(mimeType?: string): FileType {
		return mimeType === 'application/vnd.google-apps.folder' ? FileType.Folder : FileType.File;
	}

	private isFilePubliclyShared(file: GoogleDriveFile): boolean {
		return (file.permissions ?? []).some(
			permission => permission.type === PUBLIC_SHARED_PERMISSION_TYPE
		);
	}
}
