import {
	ConnectDriveRequestBody,
	DriveEntity,
	DriveType,
	Status,
} from '../../shared/types/global.types';
import { deleteRequest, getRequest, postRequest } from '../request.service';

export const getAuthLink = async (drive: DriveType): Promise<string> => {
	const res = await getRequest<string>(`/drives/${drive}/authlink`);
	const authLink = res.data;

	return authLink;
};

export const connectDrive = async (authCode: string, drive: DriveType): Promise<boolean> => {
	const res = await postRequest<ConnectDriveRequestBody, void>(`/drives/${drive}/connect`, {
		authCode,
	});

	return res.status === Status.OK;
};

export const getDriveEntities = async (): Promise<DriveEntity[]> => {
	const { data } = await getRequest<DriveEntity[]>('/drives');
	return data;
};

export const deleteDriveEntity = async (driveEmail: string, drive: DriveType): Promise<boolean> => {
	const res = await deleteRequest(`/drives/${drive}/${driveEmail}`);
	return res.status === Status.OK;
};
