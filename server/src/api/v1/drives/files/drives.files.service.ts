import { DriveRepository } from '../../../../services/database/DatabaseFactory';
import { FileEntity, FileType, Nullable } from '../../../../types/global.types';
import { getDriveContextAndToken } from '../drives.helpers';

export class VirtualDriveFilesService {
	async getRootFiles(userEmail: string, driveIds: string[]): Promise<Nullable<FileEntity[]>> {
		const fileEntities: Array<FileEntity[]> = [];
		const allDrives = await DriveRepository.getAllDrives(userEmail);

		const filteredDrives = allDrives?.filter(drive => driveIds.includes(drive.id));

		if (filteredDrives) {
			const promiseArr: Promise<Nullable<FileEntity[]>>[] = [];

			try {
				filteredDrives.forEach(async drive => {
					const { token: encryptedTokenStr, driveType, id: driveId } = drive;
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
		const drive = await DriveRepository.getDrive(userEmail, driveId);

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
		const drive = await DriveRepository.getDrive(userEmail, driveId);

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
		const drive = await DriveRepository.getDrive(userEmail, driveId);

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
		const drive = await DriveRepository.getDrive(userEmail, driveId);

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
		const drive = await DriveRepository.getDrive(userEmail, driveId);
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
		const drive = await DriveRepository.getDrive(userEmail, driveId);
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
		const drive = await DriveRepository.getDrive(userEmail, driveId);

		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.downloadFile(token, fileId, driveId);
			}
		}
		return true;
	}

	public async uploadFile(
		driveId: string,
		userEmail: string,
		file: Express.Multer.File,
		parentFolderId?: string
	): Promise<Nullable<FileEntity>> {
		const drive = await DriveRepository.getDrive(userEmail, driveId);

		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.uploadFile(token, file, driveId, parentFolderId);
			}
		}

		return null;
	}

	public async openFile(
		driveId: string,
		userEmail: string,
		fileId: string
	): Promise<Nullable<string>> {
		const drive = await DriveRepository.getDrive(userEmail, driveId);

		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.openFile(token, fileId);
			}
		}

		return null;
	}

	public async getThumbnailLink(
		driveId: string,
		userEmail: string,
		fileId: string
	): Promise<Nullable<string>> {
		const drive = await DriveRepository.getDrive(userEmail, driveId);

		if (drive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.getThumbnailLink(token, fileId);
			}
		}

		return null;
	}
}

export default new VirtualDriveFilesService();
