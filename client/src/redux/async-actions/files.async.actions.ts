import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriveType } from '../../shared/types/global.types';
import FilesService from '../../services/drives/files/drives.files.service';

export const getRootFiles = createAsyncThunk('files/getRootFiles', async () => {
	const files = await FilesService.getRootFiles();
	return files;
});

type GetFolderFilesParams = { drive: DriveType; email: string; id: string };
export const getFolderDriveFiles = createAsyncThunk(
	'files/getFolderDriveFiles',
	async ({ drive, email, id }: GetFolderFilesParams) => {
		const files = await FilesService.getFolderFiles(drive, email, id);
		return files;
	}
);

type DeleteFileParams = { drive: DriveType; email: string; id: string };
export const deleteFile = createAsyncThunk(
	'files/deleteFile',
	async ({ drive, email, id }: DeleteFileParams) => {
		await FilesService.deleteDriveFile(drive, email, id);
		return id;
	}
);

type RenameFileParams = { drive: DriveType; email: string; id: string; newName: string };
export const renameFile = createAsyncThunk(
	'files/renameFile',
	async ({ drive, email, id, newName }: RenameFileParams) => {
		const name = await FilesService.renameDriveFile(drive, email, id, newName);
		return { name, id };
	}
);

type ShareFileParams = { drive: DriveType; email: string; id: string };
export const shareFile = createAsyncThunk(
	'files/shareFile',
	async ({ drive, email, id }: ShareFileParams) => {
		const sharedLink = await FilesService.shareDriveFile(drive, email, id);
		return { sharedLink, id };
	}
);

type UnshareFileParams = { drive: DriveType; email: string; id: string };
export const unshareFile = createAsyncThunk(
	'files/unshareFile',
	async ({ drive, email, id }: UnshareFileParams) => {
		await FilesService.unshareDriveFile(drive, email, id);
		return id;
	}
);
