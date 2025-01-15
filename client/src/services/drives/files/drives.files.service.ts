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

	public async openDriveFile(driveId: string, fileId: string): Promise<boolean> {
		const res = await RequestService.get(`drives/${driveId}/files/${fileId}/open`);

		return res.status === Status.OK;
	}
}

export default new FilesService();
