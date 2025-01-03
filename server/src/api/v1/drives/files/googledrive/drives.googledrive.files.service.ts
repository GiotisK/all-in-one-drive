import DatabaseService from '../../../../../services/database/mongodb.service';
import GoogleDriveStrategy from '../../../../../services/drive/GoogleDriveStrategy';
import { DriveType, Nullable } from '../../../../../types/global.types';
import { getDriveContextAndToken } from '../../drives.helpers';

class GoogleDriveFilesService {
	public async getExportFormats(
		userEmail: string,
		driveId: string,
		fileId: string
	): Promise<Nullable<string[]>> {
		const drive = await DatabaseService.getDrive(userEmail, driveId);

		if (drive?.driveType === DriveType.GoogleDrive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken?.token) {
				const googleDrive = new GoogleDriveStrategy();

				return googleDrive.getExportFormats(ctxAndToken.token, fileId);
			}
		}

		return null;
	}

	public async exportFile(userEmail: string, driveId: string, fileId: string, mimeType: string) {
		const drive = await DatabaseService.getDrive(userEmail, driveId);

		if (drive?.driveType === DriveType.GoogleDrive) {
			const { driveType, token: encryptedToken } = drive;
			const ctxAndToken = getDriveContextAndToken(driveType, encryptedToken);

			if (ctxAndToken?.token) {
				const googleDrive = new GoogleDriveStrategy();

				return googleDrive.exportFile(ctxAndToken.token, fileId, mimeType);
			}
		}

		return null;
	}
}

export default new GoogleDriveFilesService();
