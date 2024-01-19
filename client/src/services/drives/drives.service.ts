import {
	ConnectDriveRequestBody,
	DriveEntity,
	DriveType,
	Nullable,
	Status,
} from '../../shared/types/global.types';
import { deleteRequest, getRequest, postRequest } from '../request.service';

export const getAuthLink = async (drive: DriveType): Promise<string> => {
	try {
		const res = await getRequest<string>(`/drives/${drive}/authlink`);
		const authLink = res.data;

		return authLink;
	} catch {
		return '';
	}
};

export const connectDrive = async (authCode: string, drive: DriveType): Promise<boolean> => {
	try {
		const res = await postRequest<ConnectDriveRequestBody, void>(`/drives/${drive}/connect`, {
			authCode,
		});

		return res.status === Status.OK;
	} catch {
		return false;
	}
};

export const getDriveEntities = async (): Promise<Nullable<DriveEntity[]>> => {
	try {
		const res = await getRequest<DriveEntity[]>('/drives');

		return res.data;
	} catch {
		return null;
	}
};

export const deleteDriveEntity = async (driveEmail: string, drive: DriveType): Promise<boolean> => {
	try {
		const res = await deleteRequest(`/drives/${drive}/${driveEmail}`);

		return res.status === Status.OK;
	} catch {
		return false;
	}
};
