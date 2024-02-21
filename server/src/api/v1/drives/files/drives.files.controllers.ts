import { Request, Response } from 'express';
import { AuthLocals } from '../../../../types/types';
import FilesService from './drives.files.service';
import {
	CreateFileRequestBody,
	DriveType,
	FileEntity,
	PatchFileRequestBody,
	PatchFileResponse,
	Status,
} from '../../../../types/global.types';

class FilesController {
	public async getRootFiles(
		_req: Request,
		res: Response<FileEntity[], AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const files = await FilesService.getRootFiles(email);

		if (files) {
			res.status(Status.OK).send(files);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).send();
		}
	}

	public async getFolderFiles(
		req: Request<{ drive: DriveType; email: string; folderId: string }>,
		res: Response<FileEntity[], AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { drive, email: driveEmail, folderId } = req.params;
		const files = await FilesService.getFolderFiles(drive, userEmail, driveEmail, folderId);

		if (files) {
			res.status(Status.OK).send(files);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).send();
		}
	}

	public async deleteFile(
		req: Request<{ drive: DriveType; email: string; fileId: string }>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { drive, email: driveEmail, fileId } = req.params;
		const success = await FilesService.deleteFile(drive, userEmail, driveEmail, fileId);
		const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(statusId).send();
	}

	public async editFile(
		req: Request<
			{ drive: DriveType; email: string; fileId: string },
			void,
			PatchFileRequestBody
		>,
		res: Response<PatchFileResponse, AuthLocals>
	): Promise<void> {
		const { name, share } = req.body;
		const { drive, email: driveEmail, fileId } = req.params;
		const { email: userEmail } = res.locals;
		const responseBody: PatchFileResponse = { operation: {} };
		let renameSuccess = false;
		let shareSuccess = false;
		let unshareSuccess = false;

		//TODO: refactor to separate functions?
		if (name) {
			renameSuccess = await FilesService.renameFile(
				drive,
				userEmail,
				driveEmail,
				fileId,
				name
			);
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
			const sharedLink = await FilesService.shareFile(drive, userEmail, driveEmail, fileId);
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
			unshareSuccess = await FilesService.unshareFile(drive, userEmail, driveEmail, fileId);
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
	}

	public async createFile(
		req: Request<{ drive: DriveType; email: string }, void, CreateFileRequestBody>,
		res: Response<FileEntity, AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { drive, email: driveEmail } = req.params;
		const { type, parentFolderId } = req.body;

		const file = await FilesService.createFile(
			drive,
			userEmail,
			driveEmail,
			type,
			parentFolderId
		);

		if (file) {
			res.status(Status.OK).send(file);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).send();
		}
	}
}

export default new FilesController();
