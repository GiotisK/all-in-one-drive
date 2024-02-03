import { Request, Response } from 'express';
import { AuthLocals } from '../../../../types/types';
import {
	deleteFile,
	getRootFiles,
	renameFile,
	shareFile,
	unshareFile,
} from './drives.files.service';
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
	const responseBody: PatchFileResponse = { operation: {} };
	let renameSuccess = false;
	let shareSuccess = false;
	let unshareSuccess = false;

	//TODO: refactor to separate functions?
	if (name) {
		renameSuccess = await renameFile(drive, userEmail, driveEmail, fileId, name);
		if (renameSuccess) {
			responseBody.operation = {
				rename: {
					success: true,
					name,
				},
			};
		}
	}

	if (share === true) {
		const sharedLink = await shareFile(drive, userEmail, driveEmail, fileId);
		if (sharedLink) {
			shareSuccess = true;
			responseBody.operation = {
				share: {
					sharedLink,
					success: true,
				},
			};
		}
	}

	if (share === false) {
		unshareSuccess = await unshareFile(drive, userEmail, driveEmail, fileId);
		if (unshareSuccess) {
			responseBody.operation = {
				unshare: {
					success: true,
				},
			};
		}
	}

	if (renameSuccess || shareSuccess || unshareSuccess) {
		res.status(Status.OK).send(responseBody);
	} else {
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};
