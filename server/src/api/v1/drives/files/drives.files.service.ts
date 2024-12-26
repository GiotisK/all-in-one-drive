import DatabaseService from '../../../../services/database/mongodb.service';
import { DriveType, FileEntity, FileType, Nullable } from '../../../../types/global.types';
import { getDriveContextAndToken } from '../drives.helpers';

export class FilesService {
	async getRootFiles(userEmail: string): Promise<Nullable<FileEntity[]>> {
		const fileEntities: Array<FileEntity[]> = [];
		const driveProperties = await DatabaseService.getAllDrives(userEmail);

		if (driveProperties) {
			const promiseArr: Promise<Nullable<FileEntity[]>>[] = [];

			try {
				driveProperties.forEach(async properties => {
					const { token: encryptedTokenStr, driveType, id: driveId } = properties;
					const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);

					if (ctxAndToken) {
						const { ctx, token } = ctxAndToken;
						promiseArr.push(ctx.getDriveFiles(token, driveId));
					}
				});

				const fileEntityLists = await Promise.all(promiseArr);

				fileEntityLists.forEach(list => {
					if (list) {
						fileEntities.push(list);
					}
				});

				return fileEntities.flat() ?? null;
			} catch {
				return null;
			}
		}

		return null;
	}

	public async getFolderFiles(
		driveId: string,
		userEmail: string,
		folderId: string
	): Promise<Nullable<FileEntity[]>> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);

		if (drive) {
			const { driveType, token: encryptedToken, id: driveId } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.getDriveFiles(token, driveId, folderId);
			}
		}

		return null;
	}

	public async deleteFile(driveId: string, userEmail: string, fileId: string): Promise<boolean> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);

		if (!drive) {
			return false;
		}

		const { driveType, token: encryptedToken } = drive;
		const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);
		if (ctxAndToken) {
			const { ctx, token } = ctxAndToken;
			return ctx.deleteFile(token, fileId);
		}

		return false;
	}

	public async renameFile(
		driveId: string,
		userEmail: string,
		fileId: string,
		name: string
	): Promise<boolean> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);

		//TODO: use early return everywhere or sthhhh
		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.renameFile(token, fileId, name);
			}
		}

		return false;
	}

	public async shareFile(
		userEmail: string,
		driveId: string,
		fileId: string
	): Promise<Nullable<string>> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);

		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.shareFile(token, fileId);
			}
		}

		return null;
	}

	public async unshareFile(driveId: string, userEmail: string, fileId: string): Promise<boolean> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.unshareFile(token, fileId);
			}
		}

		return false;
	}

	public async createFile(
		driveId: string,
		userEmail: string,
		fileType: FileType,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);
		if (drive) {
			const { driveType, token: encryptedToken, id: driveId } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.createFile(token, fileType, driveId, parentFolderId);
			}
		}

		return null;
	}

	public async downloadFile(
		driveId: string,
		userEmail: string,
		fileId: string
	): Promise<boolean> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);

		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.downloadFile(token, fileId);
			}
		}
		return true;
	}
}

export default new FilesService();
