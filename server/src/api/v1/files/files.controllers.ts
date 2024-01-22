import { Request, Response } from 'express';
import { AuthLocals } from '../../../types/types';
import { getRootFiles } from './files.service';
import { Status } from '../../../types/global.types';

export const getRootFilesController = async (req: Request, res: Response) => {
	const { email } = res.locals as AuthLocals;
	const files = await getRootFiles(email);

	if (files) {
		res.status(Status.OK).send(files);
	} else {
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};
