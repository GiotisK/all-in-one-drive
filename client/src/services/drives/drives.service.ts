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

	public async subscribeForDriveChanges(driveId: string): Promise<WatchChangesChannel> {
		const { data: watchChangesChannel } = await RequestService.post<
			SubscribeForChangesRequestBody,
			WatchChangesChannel
		>('/drives/watch', {
			driveId,
		});

		return watchChangesChannel;
	}

	public async unsubscribeForDriveChanges(
		driveId: string,
		id: string,
		resourceId: string
	): Promise<void> {
		await RequestService.post<UnsubscribeForChangesRequestBody, void>('/drives/stopwatch', {
			driveId,
			id,
			resourceId,
		});
	}

	public async getDriveChanges(driveId: string, startPageToken: string) {
		const { data: changes } = await RequestService.get<DriveChanges>(
			`/drives/${driveId}/changes?startPageToken=${startPageToken}`
		);

		return {
			driveId,
			changes,
		};
	}
}

export default new DrivesService();
