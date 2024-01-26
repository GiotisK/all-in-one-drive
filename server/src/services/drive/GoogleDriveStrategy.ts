import { OAuth2Client } from 'googleapis-common';
import { IDriveStrategy } from './IDriveStrategy';
import { drive, auth, drive_v3 } from '@googleapis/drive';
import { bytesToGigabytes, normalizeBytes } from '../../helpers/helpers';
import { DriveQuota, DriveType, FileEntity, FileType, Nullable } from '../../types/global.types';
import mime from 'mime-types';

type Credentials = typeof auth.OAuth2.prototype.credentials;
type GoogleDriveFile = drive_v3.Schema$File;

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

	public async getDriveFiles(token: string, folderId?: string): Promise<Nullable<FileEntity[]>> {
		try {
			this.setToken(token);
			const filesQuery = this.createFilesQuery(folderId);
			const res = await this.drive.files.list({
				q: filesQuery,
				pageSize: 1000,
				fields: 'nextPageToken, files(id, size, name, mimeType, createdTime, webContentLink, exportLinks, parents, permissionIds, owners)',
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
	): FileEntity[] {
		const driveEntities: FileEntity[] = files.map(file => {
			const fileType = this.determineEntityType(file.mimeType ?? '');
			const size = fileType === FileType.File ? normalizeBytes(file.size ?? '') : '';
			const normalizedDate = file.createdTime?.substring(0, 10) ?? '-';
			const extension = file.mimeType ? mime.extension(file.mimeType) : '-';

			return {
				id: file.id ?? '',
				name: file.name ?? '-',
				drive: DriveType.GoogleDrive,
				email: driveEmail,
				type: fileType,
				size: size,
				date: normalizedDate,
				extension: extension || '-',
			};
		});

		return driveEntities;
	}

	private determineEntityType(mimeType?: string): FileType {
		return mimeType === 'application/vnd.google-apps.folder' ? FileType.Folder : FileType.File;
	}
}
