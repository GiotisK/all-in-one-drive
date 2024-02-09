import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriveType } from '../../shared/types/global.types';
import {
	deleteDriveFile,
	getFolderFiles,
	getRootFiles,
	renameDriveFile,
	shareDriveFile,
	unshareDriveFile,
} from '../../services/drives/files/drives.files.service';

//TODO: fix names, getfiles is generic but cant use getrootfiles
export const getFiles = createAsyncThunk('files/getRootFiles', async () => {
	const files = await getRootFiles();
	return files;
});

type GetFolderFilesParams = { drive: DriveType; email: string; id: string };
export const getFolderDriveFiles = createAsyncThunk(
	'files/getFolderDriveFiles',
	async ({ drive, email, id }: GetFolderFilesParams) => {
		const files = await getFolderFiles(drive, email, id);
		return files;
	}
);

type DeleteFileParams = { drive: DriveType; email: string; id: string };
export const deleteFile = createAsyncThunk(
	'files/deleteFile',
	async ({ drive, email, id }: DeleteFileParams) => {
		await deleteDriveFile(drive, email, id);
		return id;
	}
);

type RenameFileParams = { drive: DriveType; email: string; id: string; newName: string };
export const renameFile = createAsyncThunk(
	'files/renameFile',
	async ({ drive, email, id, newName }: RenameFileParams) => {
		const name = await renameDriveFile(drive, email, id, newName);
		return { name, id };
	}
);

type ShareFileParams = { drive: DriveType; email: string; id: string };
export const shareFile = createAsyncThunk(
	'files/shareFile',
	async ({ drive, email, id }: ShareFileParams) => {
		const sharedLink = await shareDriveFile(drive, email, id);
		return { sharedLink, id };
	}
);

type UnshareFileParams = { drive: DriveType; email: string; id: string };
export const unshareFile = createAsyncThunk(
	'files/unshareFile',
	async ({ drive, email, id }: UnshareFileParams) => {
		await unshareDriveFile(drive, email, id);
		return id;
	}
);
