import { Request, Response } from 'express';
import { AuthLocals } from '../../../../types/types';
import { deleteFile, getRootFiles, renameFile } from './drives.files.service';
import {
	DriveType,
	FileEntity,
	PatchFileRequestBody,
	PatchFileResponse,
	Status,
} from '../../../../types/global.types';

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

type DeleteFilePathParams = { drive: DriveType; email: string; fileId: string };
export const deleteFileController = async (
	req: Request<DeleteFilePathParams>,
	res: Response<void, AuthLocals>
) => {
	const { email: userEmail } = res.locals;
	const { drive, email: driveEmail, fileId } = req.params;
	const success = await deleteFile(drive, userEmail, driveEmail, fileId);
	const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

	res.status(statusId).send();
};

type PatchFilePathParams = { drive: DriveType; email: string; fileId: string };
export const editFileController = async (
	req: Request<PatchFilePathParams, void, PatchFileRequestBody>,
	res: Response<PatchFileResponse, AuthLocals>
) => {
	const { name, share } = req.body;
	const { drive, email: driveEmail, fileId } = req.params;
	const { email: userEmail } = res.locals;
	const responseBody: PatchFileResponse = {};
	let renameSuccess = false;
	let shareSuccess = false;

	if (name) {
		renameSuccess = await renameFile(drive, userEmail, driveEmail, fileId, name);
		if (renameSuccess) {
			responseBody.name = name;
		}
	}

	if (share) {
		//sharedLink = await shareFile(drive, userEmail, driveEmail, fileId);
		// if(shareSuccess){
		// 	responseBody.sharedLink = sharedLink
		// }
	}

	if (renameSuccess || shareSuccess) {
		res.status(Status.OK).send(responseBody);
	} else {
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};
