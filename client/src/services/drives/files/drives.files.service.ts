import { DriveType, FileEntity, Nullable, Status } from '../../../shared/types/global.types';
import { deleteRequest, getRequest } from '../../request.service';

export const getRootFiles = async (): Promise<Nullable<FileEntity[]>> => {
	try {
		const { data: fileEntities } = await getRequest<FileEntity[]>('/drives/files');

		return fileEntities;
	} catch {
		return null;
	}
};

export const deleteDriveFile = async (
	drive: DriveType,
	driveEmail: string,
	fileId: string
): Promise<boolean> => {
	try {
		const res = await deleteRequest(`drives/${drive}/${driveEmail}/files/${fileId}`);
		return res.status === Status.OK;
	} catch {
		return false;
	}
};
