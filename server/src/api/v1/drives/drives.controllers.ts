import { Request, Response } from 'express';
import {
	getAuthLink,
	generateAndSaveOAuth2Token,
	getDriveQuota,
	getDriveEntities,
	deleteDriveEntity,
} from './drives.service';
import {
	ConnectDriveRequestBody,
	DriveEntity,
	DriveQuota,
	DriveType,
	Status,
} from '../../../types/global.types';
import { AuthLocals } from '../../../types/types';

export const authLinkController = (
	req: Request<{ drive: DriveType }>,
	res: Response<string>
): void => {
	const drive = req.params.drive;
	const authLink = getAuthLink(drive);

	authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
};

export const connectDriveController = async (
	req: Request<{ drive: DriveType }, void, ConnectDriveRequestBody>,
	res: Response<void, AuthLocals>
): Promise<void> => {
	const { email } = res.locals;
	const drive = req.params.drive;
	const { authCode } = req.body;
	const success = await generateAndSaveOAuth2Token(authCode, drive, email);
	const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

	res.status(statusId).send();
};

export const driveQuotaController = async (
	req: Request<{ drive: DriveType; email: string }>,
	res: Response<DriveQuota, AuthLocals>
): Promise<void> => {
	const { email } = res.locals;
	const drive = req.params.drive;
	const driveEmail = req.params.email;

	const quota = await getDriveQuota(email, driveEmail, drive);

	if (quota) {
		res.status(Status.OK).send(quota);
	} else {
		res.status(Status.INTERNAL_SERVER_ERROR);
	}
};

export const getDrivesController = async (
	_req: Request,
	res: Response<DriveEntity[], AuthLocals>
): Promise<void> => {
	const { email } = res.locals;
	const driveEntities = await getDriveEntities(email);

	if (driveEntities) {
		res.status(Status.OK).send(driveEntities);
	} else {
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};

export const deleteDriveController = async (
	req: Request<{ drive: DriveType; email: string }>,
	res: Response<void, AuthLocals>
): Promise<void> => {
	const { email } = res.locals;
	const { drive, email: driveEmail } = req.params;
	const success = await deleteDriveEntity(email, driveEmail, drive);
	const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

	res.status(statusId).send();
};
