import { createAsyncThunk } from '@reduxjs/toolkit';
import { FileType } from '../../shared/types/global.types';
import FilesService from '../../services/drives/files/drives.files.service';

export const getRootFiles = createAsyncThunk('files/getRootFiles', async () => {
	const files = await FilesService.getRootFiles();
	return files;
});

type GetFolderFilesParams = { driveId: string; folderId: string };
export const getFolderDriveFiles = createAsyncThunk(
	'files/getFolderDriveFiles',
	async ({ driveId, folderId }: GetFolderFilesParams) => {
		const files = await FilesService.getFolderFiles(driveId, folderId);
		return files;
	}
);

type DeleteFileParams = { driveId: string; fileId: string };
export const deleteFile = createAsyncThunk(
	'files/deleteFile',
	async ({ driveId, fileId }: DeleteFileParams) => {
		await FilesService.deleteDriveFile(driveId, fileId);
		return fileId;
	}
);

type RenameFileParams = { driveId: string; fileId: string; newName: string };
export const renameFile = createAsyncThunk(
	'files/renameFile',
	async ({ driveId, fileId, newName }: RenameFileParams) => {
		const name = await FilesService.renameDriveFile(driveId, fileId, newName);
		return { name, fileId };
	}
);

type ShareFileParams = { driveId: string; fileId: string };
export const shareFile = createAsyncThunk(
	'files/shareFile',
	async ({ driveId, fileId }: ShareFileParams) => {
		const sharedLink = await FilesService.shareDriveFile(driveId, fileId);
		return { sharedLink, fileId };
	}
);

type UnshareFileParams = { driveId: string; fileId: string };
export const unshareFile = createAsyncThunk(
	'files/unshareFile',
	async ({ driveId, fileId }: UnshareFileParams) => {
		await FilesService.unshareDriveFile(driveId, fileId);
		return fileId;
	}
);

type CreateFolderParams = { driveId: string; parentFolderId?: string };
export const createFolder = createAsyncThunk(
	'files/createFolder',
	async ({ driveId, parentFolderId }: CreateFolderParams) => {
		const folder = await FilesService.createFile(driveId, FileType.Folder, parentFolderId);
		return folder;
	}
);

type DownloadFileParams = { driveId: string; fileId: string };
export const downloadFile = createAsyncThunk(
	'files/downloadFile',
	async ({ driveId, fileId }: DownloadFileParams) => {
		await FilesService.downloadDriveFile(driveId, fileId);
		return { driveId, fileId };
	}
);
