import { DriveType, FileEntity, Status } from '../../../shared/types/global.types';
import { deleteRequest, getRequest } from '../../request.service';

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
