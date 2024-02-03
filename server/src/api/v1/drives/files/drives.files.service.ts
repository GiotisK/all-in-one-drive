import { getAllDrives, getDrive } from '../../../../services/database/mongodb.service';
import { DriveType, FileEntity, Nullable } from '../../../../types/global.types';
import { getDriveContextAndToken } from '../drives.helpers';

export const getRootFiles = async (userEmail: string): Promise<Nullable<FileEntity[]>> => {
	const fileEntities: Array<FileEntity[]> = [];
	const driveProperties = await getAllDrives(userEmail);

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
};

export const deleteFile = async (
	drive: DriveType,
	userEmail: string,
	driveEmail: string,
	fileId: string
): Promise<boolean> => {
	const driveProperties = await getDrive(userEmail, driveEmail, drive);
	if (driveProperties) {
		try {
			const { token: encryptedTokenStr, driveType } = driveProperties;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.deleteFile(token, fileId);
			}
		} catch {
			return false;
		}
	}
	return false;
};

export const renameFile = async (
	drive: DriveType,
	userEmail: string,
	driveEmail: string,
	fileId: string,
	name: string
): Promise<boolean> => {
	const driveProperties = await getDrive(userEmail, driveEmail, drive);
	if (driveProperties) {
		try {
			const { token: encryptedTokenStr, driveType } = driveProperties;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return ctx.renameFile(token, fileId, name);
			}
		} catch {
			return false;
		}
	}
	return false;
};

export const shareFile = async (
	drive: DriveType,
	userEmail: string,
	driveEmail: string,
	fileId: string
): Promise<Nullable<string>> => {
	const driveProperties = await getDrive(userEmail, driveEmail, drive);
	if (driveProperties) {
		try {
			const { token: encryptedTokenStr, driveType } = driveProperties;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				const sharedLink = await ctx.shareFile(token, fileId);
				return sharedLink ?? null;
			}
		} catch (e) {
			return null;
		}
	}
	return null;
};

export const unshareFile = async (
	drive: DriveType,
	userEmail: string,
	driveEmail: string,
	fileId: string
): Promise<boolean> => {
	const driveProperties = await getDrive(userEmail, driveEmail, drive);
	if (driveProperties) {
		try {
			const { token: encryptedTokenStr, driveType } = driveProperties;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);
			if (ctxAndToken) {
				const { ctx, token } = ctxAndToken;
				return await ctx.unshareFile(token, fileId);
			}
		} catch {
			return false;
		}
	}
	return false;
};
