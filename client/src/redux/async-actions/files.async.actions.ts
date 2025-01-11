import { createAsyncThunk } from '@reduxjs/toolkit';
import { FileType } from '../../shared/types/global.types';
import FilesService from '../../services/drives/files/drives.files.service';
import GoogledriveFilesService from '../../services/drives/files/googledrive/googledrive.files.service';

type RenameFileParams = { driveId: string; fileId: string; newName: string };
export const renameFile = createAsyncThunk(
	'files/renameFile',
	async ({ driveId, fileId, newName }: RenameFileParams) => {
		const name = await FilesService.renameDriveFile(driveId, fileId, newName);
		return { name, fileId };
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

type UploadFileParams = { driveId: string; file: File; parentFolderId?: string };
export const uploadFile = createAsyncThunk(
	'files/uploadFile',
	async ({ driveId, file, parentFolderId }: UploadFileParams) => {
		const fileEntity = await FilesService.uploadDriveFile(driveId, file, parentFolderId);
		return fileEntity;
	}
);

type ExportGoogleDriveFileParams = { driveId: string; fileId: string; mimeType: string };
export const exportGoogleDriveFile = createAsyncThunk(
	'files/exportGoogleDriveFile',
	async ({ driveId, fileId, mimeType }: ExportGoogleDriveFileParams) => {
		const exportFormats = await GoogledriveFilesService.exportGoogleDriveFile(
			driveId,
			fileId,
			mimeType
		);
		return exportFormats;
	}
);
