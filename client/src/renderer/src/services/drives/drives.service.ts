import RequestService from '../request.service';
import { DriveChanges } from '../../shared/types/global.types';

export class DrivesService {
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
