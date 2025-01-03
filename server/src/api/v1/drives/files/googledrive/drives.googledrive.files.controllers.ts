import { Request, Response } from 'express';
import { AuthLocals } from '../../../../../types/types';
import GoogleDriveFilesService from './drives.googledrive.files.service';
import { Status } from '../../../../../types/global.types';

class GoogleDriveFilesController {
	public async getExportFormats(
		req: Request<{ driveId: string; fileId: string }, void, void>,
		res: Response<string[], AuthLocals>
	) {
		const { email } = res.locals;
		const { driveId, fileId } = req.params;

		const exportFormats = await GoogleDriveFilesService.getExportFormats(
			email,
			driveId,
			fileId
		);

		if (exportFormats) {
			res.status(Status.OK).send(exportFormats);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async exportFile(
		req: Request<{ driveId: string; fileId: string }, void, void, { mimeType: string }>,
		res: Response<string[], AuthLocals>
	) {
		const { email } = res.locals;
		const { driveId, fileId } = req.params;
		const { mimeType } = req.query;

		const success = await GoogleDriveFilesService.exportFile(email, driveId, fileId, mimeType);

		const status = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(status).end();
	}
}

export default new GoogleDriveFilesController();
