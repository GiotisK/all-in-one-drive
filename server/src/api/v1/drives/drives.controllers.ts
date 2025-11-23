import { Request, Response } from 'express';
import DrivesService from './drives.service';
import {
	ConnectDriveRequestBody,
	DriveChanges,
	DriveEntity,
	DriveQuota,
	DriveType,
	ServerSideEventChangeData,
	Status,
	SubscribeForChangesRequestBody,
	UnsubscribeForChangesRequestBody,
	WatchChangesChannel,
} from '../../../types/global.types';
import { AuthLocals } from '../../../types/types';

import SSEManager from '../../../services/sse/SSEManager';

import VirtualDrivesService from './virtual/drives.virtual.service';

class DrivesController {
	public async authLink(
		req: Request<{ drive: DriveType }>,
		res: Response<string>
	): Promise<void> {
		const drive = req.params.drive;
		const authLink = await DrivesService.getAuthLink(drive);
		authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
	}

	public async connectDrive(
		req: Request<{ drive: DriveType }, void, ConnectDriveRequestBody>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const drive = req.params.drive;
		const { authCode } = req.body;
		const success = await DrivesService.connectDrive(authCode, drive, email);
		const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(statusId).send();
	}

	public async getDriveQuota(
		req: Request<{ driveId: string }>,
		res: Response<DriveQuota, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const driveId = req.params.driveId;

		const quota = await DrivesService.getDriveQuota(email, driveId);

		if (quota) {
			res.status(Status.OK).send(quota);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR);
		}
	}

	public async getDrives(_req: Request, res: Response<DriveEntity[], AuthLocals>): Promise<void> {
		const { email } = res.locals;

		let driveEntities = await DrivesService.getDrives(email);
		const virtualDriveEntity = await VirtualDrivesService.getVirtualDrive(email);

		if (driveEntities) {
			if (virtualDriveEntity) {
				driveEntities.unshift(virtualDriveEntity);
			}

			res.status(Status.OK).send(driveEntities);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).send();
		}
	}

	public async deleteDrive(
		req: Request<{ driveId: string }>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const driveId = req.params.driveId;
		const success = await DrivesService.deleteDrive(email, driveId);
		const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(statusId).send();
	}

	public async watchDrive(
		req: Request<{}, void, SubscribeForChangesRequestBody>,
		res: Response<WatchChangesChannel[], AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const driveIds = req.body.driveIds;

		const watchChangesChannels = await DrivesService.subscribeForDriveChanges(email, driveIds);

		if (watchChangesChannels) {
			res.status(Status.OK).send(watchChangesChannels);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async stopWatchDrive(
		req: Request<{ driveId: string }, void, UnsubscribeForChangesRequestBody>,
		res: Response<string, AuthLocals>
	) {
		const { email } = res.locals;
		const driveId = req.params.driveId;
		const { resourceId, id } = req.body;

		if (!driveId || !id || !resourceId) {
			res.status(Status.BAD_REQUEST).send('Missing required parameters');
			return;
		}

		const success = await DrivesService.unsubscribeForDriveChanges(
			email,
			driveId,
			id,
			resourceId
		);

		if (success) {
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public getChanges = async (
		req: Request<{ driveId: string }, void, void, { startPageToken?: string }>,
		res: Response<DriveChanges, AuthLocals>
	) => {
		const { email: userEmail } = res.locals;
		const { driveId } = req.params;
		const { startPageToken } = req.query;

		if (!startPageToken) {
			res.status(Status.BAD_REQUEST).end();
			return;
		}

		const changes = await DrivesService.fetchDriveChanges(driveId, userEmail, startPageToken);

		if (changes) {
			res.status(Status.OK).send(changes);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	};

	public driveSubscription = (req: Request, res: Response) => {
		SSEManager.addClient(req, res);
	};

	public driveNotification = (req: Request, res: Response): void => {
		const notificationDetails: ServerSideEventChangeData = {
			driveType: DriveType.GoogleDrive,
			driveId: req.headers['x-goog-channel-token'] as string,
			change: req.headers['x-goog-resource-state'] as 'sync' | 'change',
		};

		SSEManager.sendNotification('update-event', notificationDetails);

		res.status(Status.OK).end();
	};
}

export default new DrivesController();
