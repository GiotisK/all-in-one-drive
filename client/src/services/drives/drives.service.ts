import {
	ConnectDriveRequestBody,
	DriveEntity,
	DriveType,
	Status,
} from '../../shared/types/global.types';
import RequestService from '../request.service';

export class DrivesService {
	async getAuthLink(drive: DriveType): Promise<string> {
		const res = await RequestService.get<string>(`/drives/${drive}/authlink`);
		const authLink = res.data;
		return authLink;
	}

	async connectDrive(authCode: string, drive: DriveType): Promise<boolean> {
		const res = await RequestService.post<ConnectDriveRequestBody, void>(
			`/drives/${drive}/connect`,
			{
				authCode,
			}
		);
		return res.status === Status.OK;
	}

	async getDrives(): Promise<DriveEntity[]> {
		const { data } = await RequestService.get<DriveEntity[]>('/drives');
		return data;
	}

	async deleteDrive(driveEmail: string, drive: DriveType): Promise<boolean> {
		const res = await RequestService.delete(`/drives/${drive}/${driveEmail}`);
		return res.status === Status.OK;
	}
}

export default new DrivesService();
