import { Request, Response } from 'express';
import { getAuthLink, generateAndSaveOAuth2Token, getDriveQuota } from './drive.service';
import {
	ConnectDriveRequestBody,
	DriveType,
	GetDriveQuotaRequestBody,
	Status,
} from '../../../types/global.types';
import { AuthLocals, CustomRequest } from '../../../types/types';

export const authLinkController = (req: Request, res: Response): void => {
	const drive = req.params.drive;
	const authLink = getAuthLink(drive);

	authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
};

export const connectDriveController = async (
	req: CustomRequest<ConnectDriveRequestBody>,
	res: Response
): Promise<void> => {
	const { email } = res.locals as AuthLocals;
	const drive = req.params.drive as DriveType;
	const { authCode } = req.body;
	const success = await generateAndSaveOAuth2Token(authCode, drive, email);
	const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

	res.status(statusId).send();
};

export const driveQuotaController = async (
	req: CustomRequest<GetDriveQuotaRequestBody>,
	res: Response
): Promise<void> => {
	const { email } = res.locals as AuthLocals;
	const drive = req.params.drive as DriveType;
	const driveEmail = req.params.email;

	const quota = await getDriveQuota(email, driveEmail, drive);

	if (quota) {
		res.status(Status.OK).send(quota);
	} else {
		res.status(Status.INTERNAL_SERVER_ERROR);
	}
};
