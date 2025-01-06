import {
	FileEntity,
	Status,
	PatchFileRequestBody,
	PatchFileResponse,
	Nullable,
	CreateFileRequestBody,
	FileType,
} from '../../../shared/types/global.types';
import RequestService from '../../request.service';

export class FilesService {
	public async getRootFiles(): Promise<FileEntity[]> {
		const { data: fileEntities } = await RequestService.get<FileEntity[]>('/drives/files');
		return fileEntities;
	}

	public async getFolderFiles(driveId: string, folderId: string): Promise<FileEntity[]> {
		const { data: fileEntities } = await RequestService.get<FileEntity[]>(
			`drives/${driveId}/folders/${folderId}/files`
		);
		return fileEntities;
	}

	public async deleteDriveFile(driveId: string, fileId: string): Promise<boolean> {
		const res = await RequestService.delete(`drives/${driveId}/files/${fileId}`);
		return res.status === Status.OK;
	}

	public async renameDriveFile(
		driveId: string,
		fileId: string,
		newName: string
	): Promise<string> {
		const res = await RequestService.patch<PatchFileRequestBody, PatchFileResponse>(
			`drives/${driveId}/files/${fileId}`,
			{ name: newName }
		);
		const renameData = res.data.operation.rename;
		return renameData && renameData.success ? renameData.name : '';
	}

	public async shareDriveFile(driveId: string, fileId: string): Promise<Nullable<string>> {
		const res = await RequestService.patch<PatchFileRequestBody, PatchFileResponse>(
			`drives/${driveId}/files/${fileId}`,
			{ share: true }
		);
		const shareData = res.data.operation.share;

		return shareData && shareData.success ? shareData.sharedLink : null;
	}

	public async unshareDriveFile(driveId: string, fileId: string): Promise<boolean> {
		const { data } = await RequestService.patch<PatchFileRequestBody, PatchFileResponse>(
			`drives/${driveId}/files/${fileId}`,
			{ share: false }
		);
		const unshareData = data.operation.unshare;
		return unshareData && unshareData.success ? true : false;
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
