import { ConnectDriveRequestBody, DriveType, Status } from '../../shared/types/global.types';
import { EmptyBody } from '../../shared/types/types';
import { getRequest, postRequest } from '../request.service';

export const getAuthLink = async (drive: DriveType): Promise<string> => {
	try {
		const res = await getRequest<EmptyBody, string>(`/drive/${drive}/authlink`);
		const authLink = res.data;

		return authLink;
	} catch {
		return '';
	}
};

export const connectDrive = async (authCode: string, drive: DriveType): Promise<boolean> => {
	try {
		const res = await postRequest<ConnectDriveRequestBody, void>(`/drive/${drive}/connect`, {
			authCode,
		});

		return res.status === Status.OK;
	} catch {
		return false;
	}
};
