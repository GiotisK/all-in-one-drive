import { Request, Response } from 'express';
import { AuthLocals } from '../../../../types/types';
import { deleteFile, getRootFiles } from './drives.files.service';
import { DriveType, FileEntity, Status } from '../../../../types/global.types';

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

type DeleteFileQueryParams = { drive: DriveType; email: string; fileId: string };
export const deleteFileController = async (
	req: Request<DeleteFileQueryParams>,
	res: Response<FileEntity[], AuthLocals>
) => {
	const { email: userEmail } = res.locals;
	const { drive, email: driveEmail, fileId } = req.params;
	const success = await deleteFile(drive, userEmail, driveEmail, fileId);
	const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

	res.status(statusId).send();
};
