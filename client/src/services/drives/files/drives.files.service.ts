import {
	DriveType,
	FileEntity,
	Status,
	PatchFileRequestBody,
	PatchFileResponse,
	Nullable,
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
	const renameData = res.data.operation.rename;
	return renameData && renameData.success ? renameData.name : '';
};

export const shareDriveFile = async (
	drive: DriveType,
	driveEmail: string,
	fileId: string
): Promise<Nullable<string>> => {
	const res = await patchRequest<PatchFileRequestBody, PatchFileResponse>(
		`drives/${drive}/${driveEmail}/files/${fileId}`,
		{ share: true }
	);
	const shareData = res.data.operation.share;

	return shareData && shareData.success ? shareData.sharedLink : null;
};

export const unshareDriveFile = async (
	drive: DriveType,
	driveEmail: string,
	fileId: string
): Promise<boolean> => {
	const res = await patchRequest<PatchFileRequestBody, PatchFileResponse>(
		`drives/${drive}/${driveEmail}/files/${fileId}`,
		{ share: false }
	);
	const unshareData = res.data.operation.unshare;
	return unshareData && unshareData.success ? true : false;
};
