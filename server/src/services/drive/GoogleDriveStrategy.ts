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
	WatchChangesChannel,
} from '../../types/global.types';
import { LOCALTUNNEL_URL } from '../../tunnel/subdomain';
import mime from 'mime';

type Credentials = typeof auth.OAuth2.prototype.credentials;
type GoogleDriveFile = drive_v3.Schema$File;
type ParamsResourceChangesWatch = drive_v3.Params$Resource$Changes$Watch;

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const PUBLIC_SHARED_LINK_BASE_URL = 'https://drive.google.com/open?id=';
const PUBLIC_SHARED_PERMISSION_TYPE = 'anyone';

const WEBHOOK_EXPIRATION_TIME_IN_MS = 24 * 60 * 60 * 1000; // 24hours
const WEBHOOK_UUID = generateUUID();
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

	public async getDriveFiles(token: string, folderId?: string): Promise<Nullable<FileEntity[]>> {
		try {
			this.setToken(token);
			const filesQuery = this.createFilesQuery(folderId);
			const res = await this.drive.files.list({
				q: filesQuery,
				pageSize: 1000,
				//TODO: GIOTIS
				fields: 'nextPageToken, files(id, size, name, mimeType, createdTime, shared, webContentLink, webViewLink, exportLinks, parents, permissions, owners)',
			});
			const files = res.data.files;
			const driveEmail = await this.getUserDriveEmail(token);

			return files ? this.mapToUniversalFileEntityFormat(files, driveEmail) : null;
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

			return this.mapToUniversalFileEntityFormat(res.data, driveEmail);
		} catch {
			return null;
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

	public async fetchDriveChanges(
		token: string,
		startPageToken: string
	): Promise<DriveChanges | undefined> {
		this.setToken(token);

		try {
			const {
				data: { changes = [], newStartPageToken },
			} = await this.drive.changes.list({
				pageToken: startPageToken,
				fields: 'newStartPageToken, changes(file(id, name, permissions, webViewLink), time)',
			});

			const results: ChangedFileEntity[] = [];
			changes.forEach(change => {
				if (change.file) {
					results.push({
						id: change.file.id!,
						removed: change.removed!,
						name: change.file.name!,
						date: change.time?.substring(0, 10) ?? '-',
						sharedLink: this.isFilePubliclyShared(change.file)
							? change.file.webViewLink!
							: null,
						type: FileType.File,
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
		}
	}

	public async unsubscribeForChanges(
		token: string,
		id: string,
		resourceId: string
	): Promise<void> {
		this.setToken(token);
		try {
			await this.drive.channels.stop({
				requestBody: {
					id,
					resourceId,
				},
			});
			console.log(`Stopped drive notifications for channel id: ${id}`);
		} catch (err) {
			console.error(
				`An error occured while trying to unsubscribe for changes.\nError: ${
					(err as Error).message
				}`
			);
		}
	}

	public async subscribeForChanges(
		token: string,
		driveEmail: string
	): Promise<WatchChangesChannel | undefined> {
		this.setToken(token);
		const watchChangesChannel = await this.registerForDriveChanges(driveEmail);
		return watchChangesChannel;
	}

	private async registerForDriveChanges(
		driveEmail: string
	): Promise<WatchChangesChannel | undefined> {
		try {
			const watchChangesRequest = await this.createChangesWatchRequest(
				WEBHOOK_UUID,
				WEBHOOK_ENDPOINT,
				driveEmail
			);
			const response = await this.drive.changes.watch(watchChangesRequest);
			console.log('[GoogleDriveStrategy::registerForDriveChanges]');
			console.log(response.data);

			return {
				id: response.data.id ?? '',
				resourceId: response.data.resourceId ?? '',
				startPageToken: watchChangesRequest.pageToken ?? '',
			};
		} catch (err) {
			console.error(
				'An error occured while trying to subscribe to watch changes.\nError: ',
				(err as Error).message
			);
		}
	}

	private async createChangesWatchRequest(
		id: string,
		address: string,
		driveEmail: string
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
				token: driveEmail,
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

	private mapToUniversalFileEntityFormat(
		files: GoogleDriveFile[],
		driveEmail: string
	): FileEntity[];
	private mapToUniversalFileEntityFormat(file: GoogleDriveFile, driveEmail: string): FileEntity;
	private mapToUniversalFileEntityFormat(
		fileOrFiles: GoogleDriveFile[] | GoogleDriveFile,
		driveEmail: string
	): FileEntity[] | FileEntity {
		const isArrayOfFiles = Array.isArray(fileOrFiles);
		const files = isArrayOfFiles ? fileOrFiles : [fileOrFiles];
		const driveEntities: FileEntity[] = files.map(file => {
			const fileType = this.determineEntityType(file.mimeType ?? '');
			const size = fileType === FileType.File ? normalizeBytes(file.size ?? '') : '';
			const normalizedDate = file.createdTime?.substring(0, 10) ?? '-';
			const extension = file.mimeType ? mime.getExtension(file.mimeType) : '-';
			const isPubliclyShared = this.isFilePubliclyShared(file);

			return {
				id: file.id ?? '',
				name: file.name ?? '-',
				drive: DriveType.GoogleDrive,
				email: driveEmail,
				type: fileType,
				size: size,
				date: normalizedDate,
				extension: extension || '-',
				sharedLink: isPubliclyShared ? file.webViewLink : null,
			};
		});

		return isArrayOfFiles ? driveEntities : driveEntities[0];
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
