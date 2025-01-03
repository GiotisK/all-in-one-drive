import { Nullable } from '../../../../shared/types/global.types';
import RequestService from '../../../request.service';

class GoogleDriveFilesService {
	public async getExportFormats(driveId: string, fileId: string): Promise<Nullable<string[]>> {
		const res = await RequestService.get<string[]>(
			`drives/googledrive/${driveId}/files/${fileId}/export/formats`
		);

		return res.data;
	}

	public async exportGoogleDriveFile(
		driveId: string,
		fileId: string,
		mimeType: string
	): Promise<Nullable<string[]>> {
		const res = await RequestService.get<string[]>(
			`drives/googledrive/${driveId}/files/${fileId}/export?mimeType=${mimeType}`
		);

		return res.data;
	}
}

export default new GoogleDriveFilesService();
