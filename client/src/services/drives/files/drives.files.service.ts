import {
	DriveType,
	FileEntity,
	Status,
	PatchFileRequestBody,
	PatchFileResponse,
} from '../../../shared/types/global.types';
import { deleteRequest, getRequest, patchRequest } from '../../request.service';

export const getRootFiles = async (): Promise<FileEntity[]> => {
	const { data: fileEntities } = await getRequest<FileEntity[]>('/drives/files');
	return fileEntities;
};

export const deleteDriveFile = async (
	drive: DriveType,
	driveEmail: string,
	fileId: string
): Promise<boolean> => {
	const res = await deleteRequest(`drives/${drive}/${driveEmail}/files/${fileId}`);
	return res.status === Status.OK;
};

export const renameDriveFile = async (
	drive: DriveType,
	driveEmail: string,
	fileId: string,
	newName: string
): Promise<string> => {
	const res = await patchRequest<PatchFileRequestBody, PatchFileResponse>(
		`drives/${drive}/${driveEmail}/files/${fileId}`,
		{ name: newName }
	);
	return res.data.name ?? '';
};
