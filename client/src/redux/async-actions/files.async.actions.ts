import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriveType } from '../../shared/types/global.types';
import { deleteDriveFile, getRootFiles } from '../../services/drives/files/drives.files.service';

export const getFiles = createAsyncThunk('files/getFiles', async () => {
	const files = await getRootFiles();
	return files;
});

type DeleteFileParams = { drive: DriveType; email: string; id: string };
export const deleteFile = createAsyncThunk(
	'files/deleteFile',
	async ({ drive, email, id }: DeleteFileParams) => {
		await deleteDriveFile(drive, email, id);
		return id;
	}
);
