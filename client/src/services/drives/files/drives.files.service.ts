import {
	FileEntity,
	Status,
	CreateFileRequestBody,
	FileType,
} from '../../../shared/types/global.types';
import RequestService from '../../request.service';

export class FilesService {
	public async deleteDriveFile(driveId: string, fileId: string): Promise<boolean> {
		const res = await RequestService.delete(`drives/${driveId}/files/${fileId}`);
		return res.status === Status.OK;
	}

	public async createFile(
		driveId: string,
		type: FileType,
		parentFolderId?: string
	): Promise<FileEntity> {
		const res = await RequestService.post<CreateFileRequestBody, FileEntity>(
			`drives/${driveId}/files`,
			{
				type,
				parentFolderId,
			}
		);

		return res.data;
	}

	public async downloadDriveFile(driveId: string, fileId: string): Promise<boolean> {
		const res = await RequestService.get(`drives/${driveId}/files/${fileId}/download`);

		return res.status === Status.OK;
	}

	public async openDriveFile(driveId: string, fileId: string): Promise<boolean> {
		const res = await RequestService.get(`drives/${driveId}/files/${fileId}/open`);

		return res.status === Status.OK;
	}

	public async uploadDriveFile(
		driveId: string,
		file: File,
		parentFolderId?: string
	): Promise<FileEntity> {
		const formData = new FormData();
		formData.append('file', file);

		const res = await RequestService.post<FormData, FileEntity>(
			`/drives/${driveId}/files/upload` +
				(parentFolderId ? `?parentFolderId=${parentFolderId}` : ''),
			formData,
			'multipart/form-data'
		);

		return res.data;
	}
}

export default new FilesService();
