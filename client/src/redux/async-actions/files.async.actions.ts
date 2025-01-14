import { createAsyncThunk } from '@reduxjs/toolkit';
import { FileType } from '../../shared/types/global.types';
import FilesService from '../../services/drives/files/drives.files.service';
import GoogledriveFilesService from '../../services/drives/files/googledrive/googledrive.files.service';

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
