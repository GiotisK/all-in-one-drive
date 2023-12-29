import { Request, Response } from 'express';
import { getAuthLink, generateOAuth2Token } from './drive.service';
import { ConnectDriveRequestBody, Status } from '../../../types/global.types';
import { CustomRequest } from '../../../types/types';

export const authLinkController = (req: Request, res: Response): void => {
	const drive = req.params.drive;
	const authLink = getAuthLink(drive);

	authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
};

export const connectDriveController = async (
	req: CustomRequest<ConnectDriveRequestBody>,
	res: Response
): Promise<void> => {
	const drive = req.params.drive;
	const { authCode } = req.body;
	const success = await generateOAuth2Token(authCode, drive);
	const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

	res.status(statusId).send();
};
