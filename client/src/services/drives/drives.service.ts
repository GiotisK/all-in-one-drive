import RequestService from '../request.service';
import {
	ConnectDriveRequestBody,
	DriveChanges,
	DriveEntity,
	DriveType,
	Status,
	SubscribeForChangesRequestBody,
	UnsubscribeForChangesRequestBody,
	WatchChangesChannel,
} from '../../shared/types/global.types';

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

	public async subscribeForDriveChanges(
		email: string,
		drive: DriveType
	): Promise<WatchChangesChannel> {
		const { data: watchChangesChannel } = await RequestService.post<
			SubscribeForChangesRequestBody,
			WatchChangesChannel
		>(`/drives/watch`, {
			drive,
			email,
		});

		return watchChangesChannel;
	}

	public async unsubscribeForDriveChanges(
		email: string,
		drive: DriveType,
		id: string,
		resourceId: string
	): Promise<void> {
		await RequestService.post<UnsubscribeForChangesRequestBody, void>(`/drives/stopwatch`, {
			email,
			drive,
			id,
			resourceId,
		});
	}

	public async getDriveChanges(
		email: string,
		startPageToken: string,
		driveType: DriveType = DriveType.GoogleDrive
	) {
		const { data: changes } = await RequestService.get<DriveChanges>(
			`/drives/${driveType}/changes/${email}?startPageToken=${startPageToken}`
		);

		return {
			email,
			driveType,
			changes,
		};
	}
}

export default new DrivesService();
