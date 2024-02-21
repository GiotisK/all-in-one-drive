import {
	DriveType,
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

	public async getFolderFiles(
		drive: DriveType,
		email: string,
		id: string
	): Promise<FileEntity[]> {
		const { data: fileEntities } = await RequestService.get<FileEntity[]>(
			`drives/${drive}/${email}/files/${id}`
		);
		return fileEntities;
	}

	public async deleteDriveFile(
		drive: DriveType,
		driveEmail: string,
		fileId: string
	): Promise<boolean> {
		const res = await RequestService.delete(`drives/${drive}/${driveEmail}/files/${fileId}`);
		return res.status === Status.OK;
	}

	public async renameDriveFile(
		drive: DriveType,
		driveEmail: string,
		fileId: string,
		newName: string
	): Promise<string> {
		const res = await RequestService.patch<PatchFileRequestBody, PatchFileResponse>(
			`drives/${drive}/${driveEmail}/files/${fileId}`,
			{ name: newName }
		);
		const renameData = res.data.operation.rename;
		return renameData && renameData.success ? renameData.name : '';
	}

	public async shareDriveFile(
		drive: DriveType,
		driveEmail: string,
		fileId: string
	): Promise<Nullable<string>> {
		const res = await RequestService.patch<PatchFileRequestBody, PatchFileResponse>(
			`drives/${drive}/${driveEmail}/files/${fileId}`,
			{ share: true }
		);
		const shareData = res.data.operation.share;

		return shareData && shareData.success ? shareData.sharedLink : null;
	}

	public async unshareDriveFile(
		drive: DriveType,
		driveEmail: string,
		fileId: string
	): Promise<boolean> {
		const { data } = await RequestService.patch<PatchFileRequestBody, PatchFileResponse>(
			`drives/${drive}/${driveEmail}/files/${fileId}`,
			{ share: false }
		);
		const unshareData = data.operation.unshare;
		return unshareData && unshareData.success ? true : false;
	}

	public async createFile(
		drive: DriveType,
		driveEmail: string,
		type: FileType,
		parentFolderId?: string
	) {
		const res = await RequestService.post<CreateFileRequestBody, FileEntity>(
			`drives/${drive}/${driveEmail}/files`,
			{
				type,
				parentFolderId,
			}
		);

		return res.data;
	}
}

export default new FilesService();
