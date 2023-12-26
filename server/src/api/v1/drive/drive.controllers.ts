import { Request, Response } from 'express';
import { getAuthLink } from './drive.service';
import { Status } from '../../../types/global.types';

export const authLinkController = (req: Request, res: Response): void => {
	const driveString = req.params.drive;
	const authLink = getAuthLink(driveString);

	authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
};
