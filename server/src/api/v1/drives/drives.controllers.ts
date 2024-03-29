import { Request, Response } from 'express';
import DrivesService from './drives.service';
import {
	ConnectDriveRequestBody,
	DriveEntity,
	DriveQuota,
	DriveType,
	Status,
	SubscribeForChangesRequestBody,
	UnsubscribeForChangesRequestBody,
	WatchChangesChannel,
} from '../../../types/global.types';
import { AuthLocals } from '../../../types/types';
import { SseManager } from '../../../services/sse/SSEManager';

class DrivesController {
	constructor(private readonly sseManager: SseManager) {
		this.sseManager = sseManager;
	}

	public async authLink(
		req: Request<{ drive: DriveType }>,
		res: Response<string>
	): Promise<void> {
		const drive = req.params.drive;
		const authLink = DrivesService.getAuthLink(drive);
		authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
	}

	public async connectDrive(
		req: Request<{ drive: DriveType }, void, ConnectDriveRequestBody>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const drive = req.params.drive;
		const { authCode } = req.body;
		const success = await DrivesService.generateAndSaveOAuth2Token(authCode, drive, email);
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
		const driveEntities = await DrivesService.getDrives(email);

		if (driveEntities) {
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
		res: Response<WatchChangesChannel, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const { driveId } = req.body;

		const watchChangesChannel = await DrivesService.subscribeForDriveChanges(email, driveId);

		console.log({ watchChangesChannel });

		if (watchChangesChannel) {
			res.status(Status.OK).send(watchChangesChannel);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async stopWatchDrive(
		req: Request<any, any, UnsubscribeForChangesRequestBody>,
		res: Response<any, AuthLocals>
	) {
		const { email } = res.locals;
		const { driveId, resourceId, id } = req.body;

		if (!driveId || !id || !resourceId) {
			res.status(Status.BAD_REQUEST).send('Missing required parameters');
			return;
		}

		try {
			await DrivesService.unsubscribeForDriveChanges(email, driveId, id, resourceId);
			res.status(Status.OK).end();
		} catch (err) {
			res.status(Status.INTERNAL_SERVER_ERROR).send((err as Error).message);
		}
	}

	public getChanges = async (
		req: Request<{ driveId: string }, void, void, { startPageToken?: string }>,
		res: Response<any, AuthLocals>
	): Promise<void> => {
		const { email: userEmail } = res.locals;
		const { driveId } = req.params;
		const { startPageToken } = req.query;

		if (!startPageToken) {
			res.status(Status.BAD_REQUEST).send('StartPageToken was not provided.');
			return;
		}

		try {
			const changes = await DrivesService.fetchDriveChanges(
				driveId,
				userEmail,
				startPageToken
			);
			res.status(Status.OK).json(changes);
		} catch (error) {
			console.error('Error fetching drive changes:', error);
			res.status(Status.INTERNAL_SERVER_ERROR).send('Failed to fetch drive changes.');
		}
	};

	//TODO: Fix name
	//TODO: Maybe refactor move to another controller?
	public driveSubscription = (req: Request, res: Response) => {
		this.sseManager.addClient(req, res);
	};

	public driveNotification = (req: Request, res: Response): void => {
		const notificationDetails = {
			driveType: DriveType.GoogleDrive,
			driveEmail: req.headers['x-goog-channel-token'],
			change: req.headers['x-goog-resource-state'],
		};

		this.sseManager.sendNotification('update-event', notificationDetails);

		res.status(Status.OK).end();
	};
}

export default new DrivesController(new SseManager());
