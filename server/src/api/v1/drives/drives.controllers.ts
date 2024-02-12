import { Request, Response } from 'express';
import DrivesService from './drives.service';
import {
	ConnectDriveRequestBody,
	DriveEntity,
	DriveQuota,
	DriveType,
	Status,
} from '../../../types/global.types';
import { AuthLocals } from '../../../types/types';

class DrivesController {
	async authLink(req: Request<{ drive: DriveType }>, res: Response<string>): Promise<void> {
		const drive = req.params.drive;
		const authLink = DrivesService.getAuthLink(drive);

		authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
	}

	async connectDrive(
		req: Request<{ drive: DriveType }, void, ConnectDriveRequestBody>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const drive = req.params.drive;
		const { authCode } = req.body;
		const success = await DrivesService.generateAndSaveOAuth2Token(authCode, drive, email);
		const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(statusId).send();
	}

	async getDriveQuota(
		req: Request<{ drive: DriveType; email: string }>,
		res: Response<DriveQuota, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const drive = req.params.drive;
		const driveEmail = req.params.email;

		const quota = await DrivesService.getDriveQuota(email, driveEmail, drive);

		if (quota) {
			res.status(Status.OK).send(quota);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR);
		}
	}

	async getDrives(_req: Request, res: Response<DriveEntity[], AuthLocals>): Promise<void> {
		const { email } = res.locals;
		const driveEntities = await DrivesService.getDrives(email);

		if (driveEntities) {
			res.status(Status.OK).send(driveEntities);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).send();
		}
	}

	async deleteDrive(
		req: Request<{ drive: DriveType; email: string }>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const { drive, email: driveEmail } = req.params;
		const success = await DrivesService.deleteDrive(email, driveEmail, drive);
		const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(statusId).send();
	}
}

export default new DrivesController();
