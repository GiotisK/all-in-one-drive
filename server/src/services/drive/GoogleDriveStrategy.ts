import { OAuth2Client } from 'googleapis-common';
import { IDriveStrategy } from './IDriveStrategy';
import { drive, auth, drive_v3 } from '@googleapis/drive';
import { bytesToGigabytes, generateUUID, normalizeBytes } from '../../helpers/helpers';
import {
	ChangedFileEntity,
	DriveChanges,
	DriveQuota,
	DriveType,
	FileEntity,
	FileType,
	Nullable,
	ServerSideEventProgressData,
	Status,
	WatchChangesChannel,
} from '../../types/global.types';
import { LOCALTUNNEL_URL } from '../../tunnel/subdomain';
import mime from 'mime';
import fs from 'fs';
import FilesystemService from '../filesystem/filesystem.service';
import SSEManager from '../sse/SSEManager';
import internal from 'stream';

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

	public getAuthLink(): string {
		const authLink = this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});

		return authLink ?? null;
	}

	public async generateOAuth2token(authCode: string): Promise<string> {
		try {
			const tokenData = (await this.oAuth2Client.getToken(authCode)).tokens;

			return JSON.stringify(tokenData);
		} catch {
			return '';
		}
	}

	public async getUserDriveEmail(token: string): Promise<string> {
		try {
			this.setToken(token);
			const res = await this.drive.about.get({ fields: 'user' });
			const email = res.data.user?.emailAddress;

			return email ?? '';
		} catch {
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
				fields: 'files(id, size, name, mimeType, createdTime, webViewLink, permissions)',
			});
			const files = res.data.files;
			const driveEmail = await this.getUserDriveEmail(token);

			return files ? this.mapToUniversalFileEntityFormat(files, driveEmail, driveId) : null;
		} catch {
			return null;
		}
	}

	public async deleteFile(token: string, fileId: string): Promise<boolean> {
		try {
			this.setToken(token);
			await this.drive.files.delete({ fileId });

			return true;
		} catch {
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
		} catch {
			return false;
		}
	}

	public async createFile(
		token: string,
		fileType: FileType,
		driveId: string,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		try {
			this.setToken(token);
			const mimeType =
				fileType === FileType.Folder
					? 'application/vnd.google-apps.folder'
					: 'application/octet-stream';

			const res = await this.drive.files.create({
				requestBody: {
					name: 'New Folder',
					mimeType,
					parents: parentFolderId ? [parentFolderId] : [],
				},
				fields: 'id, name, mimeType, createdTime',
			});

			const driveEmail = await this.getUserDriveEmail(token);

			return this.mapToUniversalFileEntityFormat([res.data], driveEmail, driveId)[0];
		} catch {
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

			return false;
		} catch {
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

			const res = await this.drive.files.create({
				media: {
					mimeType: file.mimetype,
					body: fs.createReadStream(file.path),
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

			return null;
		} catch {
			return null;
		}
	}

	public async openFile(token: string, fileId: string): Promise<boolean> {
		try {
			this.setToken(token);

			const data = await this.downloadFileInternal(fileId);

			if (data) {
				FilesystemService.saveFileToTemp(data.fileData, data.name, '', true);
				return true;
			}

			return false;
		} catch {
			return false;
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

			return res.status === Status.OK;
		} catch {
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
		} catch {
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
			return false;
		} catch {
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
		} catch {
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
						date: change.time?.substring(0, 10) ?? '-',
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
			console.error(
				`An error occured while trying to fetch drive changes.\nError: ${
					(err as Error).message
				})`
			);

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
			console.log(`Stopped drive notifications for channel id: ${id}`);
			return true;
		} catch (err) {
			console.error(
				`An error occured while trying to unsubscribe for changes.\nError: ${
					(err as Error).message
				}`
			);

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

			if (shouldSendProgress) {
				this.sendDownloadProgressEvents(
					res.data,
					driveId!,
					fileId,
					metadata.size,
					metadata.name
				);
			}

			return {
				fileData: res.data,
				name: metadata.name,
			};
		} catch {
			return null;
		}
	}

	private async sendDownloadProgressEvents(
		data: internal.Readable,
		driveId: string,
		fileId: string,
		size: number,
		name: string
	) {
		let downloadedSize = 0;
		let lastLoggedPercent = 0;
		const downloadId = generateUUID();
		data.on('data', chunk => {
			downloadedSize += chunk.length;
			const percent = Math.floor((downloadedSize / size) * 100);
			if (percent >= lastLoggedPercent + 10) {
				lastLoggedPercent = percent;
				const progressData: ServerSideEventProgressData = {
					name,
					downloadId,
					fileId,
					driveId,
					type: 'download',
					percentage: percent,
				};
				SSEManager.sendNotification('download-progress-event', progressData);
			}
		});

		data.on('end', () => {
			const progressData: ServerSideEventProgressData = {
				name,
				downloadId,
				fileId,
				driveId,
				type: 'download',
				percentage: 100,
			};
			SSEManager.sendNotification('download-progress-event', progressData);
		});
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
			console.error(
				'An error occured while trying to subscribe to watch changes.\nError: ',
				(err as Error).message
			);
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
