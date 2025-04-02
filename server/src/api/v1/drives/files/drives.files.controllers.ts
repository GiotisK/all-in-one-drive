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
		req: Request<never, void, { driveIds: string[] }>,
		res: Response<FileEntity[], AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const { driveIds } = req.body;

		const files = await FilesService.getRootFiles(email, driveIds);

		if (files) {
			res.status(Status.OK).send(files);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async getFolderFiles(
		req: Request<{ driveId: string; folderId: string }>,
		res: Response<FileEntity[], AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { driveId, folderId } = req.params;

		const files = await FilesService.getFolderFiles(driveId, userEmail, folderId);

		if (files) {
			res.status(Status.OK).send(files);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async deleteFile(
		req: Request<{ driveId: string; fileId: string }>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { driveId, fileId } = req.params;

		const success = await FilesService.deleteFile(driveId, userEmail, fileId);
		const status = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(status).end();
	}

	public async editFile(
		req: Request<{ driveId: DriveType; fileId: string }, void, PatchFileRequestBody>,
		res: Response<PatchFileResponse, AuthLocals>
	): Promise<void> {
		const { name, share } = req.body;
		const { driveId, fileId } = req.params;
		const { email: userEmail } = res.locals;
		const responseBody: PatchFileResponse = { operation: {} };
		let isRequestSuccessful = false;

		//TODO: refactor to separate functions?
		if (name) {
			isRequestSuccessful = await FilesService.renameFile(driveId, userEmail, fileId, name);
			if (isRequestSuccessful) {
				responseBody.operation = {
					rename: {
						success: true,
						name,
					},
				};
			}
		}

		if (share) {
			const sharedLink = await FilesService.shareFile(userEmail, driveId, fileId);
			if (sharedLink) {
				isRequestSuccessful = true;
				responseBody.operation = {
					share: {
						sharedLink,
						success: true,
					},
				};
			}
		}

		if (share === false) {
			isRequestSuccessful = await FilesService.unshareFile(driveId, userEmail, fileId);
			if (isRequestSuccessful) {
				responseBody.operation = {
					unshare: {
						success: true,
					},
				};
			}
		}

		if (isRequestSuccessful) {
			res.status(Status.OK).send(responseBody);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async createFile(
		req: Request<{ driveId: string }, void, CreateFileRequestBody>,
		res: Response<FileEntity, AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { driveId } = req.params;
		const { type, parentFolderId } = req.body;

		const file = await FilesService.createFile(driveId, userEmail, type, parentFolderId);

		if (file) {
			res.status(Status.OK).send(file);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async downloadFile(
		req: Request<{ driveId: string; fileId: string }, void, void>,
		res: Response<FileEntity, AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { driveId, fileId } = req.params;

		const success = await FilesService.downloadFile(driveId, userEmail, fileId);

		const status = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(status).end();
	}

	public async uploadFile(
		req: Request<{ driveId: string }, void, void, { parentFolderId?: string }>,
		res: Response<FileEntity, AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { driveId } = req.params;
		const { parentFolderId } = req.query;
		const file = req.file;

		if (!file) {
			res.status(Status.BAD_REQUEST).end();
			return;
		}

		const uploadedFileEntity = await FilesService.uploadFile(
			driveId,
			userEmail,
			file,
			parentFolderId
		);

		if (uploadedFileEntity) {
			res.status(Status.OK).send(uploadedFileEntity);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async openFile(
		req: Request<{ driveId: string; fileId: string }, void, void>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email: userEmail } = res.locals;
		const { driveId, fileId } = req.params;

		const filePath = await FilesService.openFile(driveId, userEmail, fileId);

		if (filePath) {
			res.download(filePath);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}
}

export default new FilesController();
