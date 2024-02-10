import DatabaseService from '../../../../services/database/mongodb.service';
import { DriveType, FileEntity, Nullable } from '../../../../types/global.types';
import { getDriveContextAndToken } from '../drives.helpers';

export class FilesService {
	async getRootFiles(userEmail: string): Promise<Nullable<FileEntity[]>> {
		const fileEntities: Array<FileEntity[]> = [];
		const driveProperties = await DatabaseService.getAllDrives(userEmail);
		if (driveProperties) {
			const promiseArr: Promise<Nullable<FileEntity[]>>[] = [];
			try {
				driveProperties.forEach(async properties => {
					const { token: encryptedTokenStr, driveType } = properties;
					const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);

					if (ctxAndToken) {
						const { ctx, token } = ctxAndToken;
						promiseArr.push(ctx.getDriveFiles(token));
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

	async getFolderFiles(
		drive: DriveType,
		userEmail: string,
		driveEmail: string,
		folderId: string
	): Promise<Nullable<FileEntity[]>> {
		const encryptedTokenStr = await DatabaseService.getEncryptedTokenAsString(
			userEmail,
			driveEmail,
			drive
		);
		if (encryptedTokenStr) {
			const ctxAndToken = getDriveContextAndToken(drive, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.getDriveFiles(token, folderId);
			}
		}
		return null;
	}

	async deleteFile(
		drive: DriveType,
		userEmail: string,
		driveEmail: string,
		fileId: string
	): Promise<boolean> {
		const encryptedTokenStr = await DatabaseService.getEncryptedTokenAsString(
			userEmail,
			driveEmail,
			drive
		);
		if (encryptedTokenStr) {
			const ctxAndToken = getDriveContextAndToken(drive, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.deleteFile(token, fileId);
			}
		}
		return false;
	}

	async renameFile(
		drive: DriveType,
		userEmail: string,
		driveEmail: string,
		fileId: string,
		name: string
	): Promise<boolean> {
		const encryptedTokenStr = await DatabaseService.getEncryptedTokenAsString(
			userEmail,
			driveEmail,
			drive
		);
		if (encryptedTokenStr) {
			const ctxAndToken = getDriveContextAndToken(drive, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.renameFile(token, fileId, name);
			}
		}
		return false;
	}

	async shareFile(
		drive: DriveType,
		userEmail: string,
		driveEmail: string,
		fileId: string
	): Promise<Nullable<string>> {
		const encryptedTokenStr = await DatabaseService.getEncryptedTokenAsString(
			userEmail,
			driveEmail,
			drive
		);
		if (encryptedTokenStr) {
			const ctxAndToken = getDriveContextAndToken(drive, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.shareFile(token, fileId);
			}
		}
		return null;
	}

	async unshareFile(
		drive: DriveType,
		userEmail: string,
		driveEmail: string,
		fileId: string
	): Promise<boolean> {
		const encryptedTokenStr = await DatabaseService.getEncryptedTokenAsString(
			userEmail,
			driveEmail,
			drive
		);
		if (encryptedTokenStr) {
			const ctxAndToken = getDriveContextAndToken(drive, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.unshareFile(token, fileId);
			}
		}
		return false;
	}
}

export default new FilesService();
