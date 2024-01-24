import { Request, Response } from 'express';
import { AuthLocals } from '../../../types/types';
import { getRootFiles } from './files.service';
import { FileEntity, Status } from '../../../types/global.types';

export const getRootFilesController = async (
	_req: Request,
	res: Response<FileEntity[], AuthLocals>
) => {
	const { email } = res.locals;
	const files = await getRootFiles(email);

	if (files) {
		res.status(Status.OK).send(files);
	} else {
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};

export const deleteFileController = async () => {};
