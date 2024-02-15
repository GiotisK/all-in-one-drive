import { Request, Response } from 'express';
import DrivesService from './drives.service';
import {
	ConnectDriveRequestBody,
	DriveEntity,
	DriveQuota,
	DriveType,
	Status,
	WatchChangesChannel,
} from '../../../types/global.types';
import { AuthLocals } from '../../../types/types';
import { SseManager } from '../../../services/sse/SSEManager';

class DrivesController {
	constructor(private readonly sseManager: SseManager) {
		this.sseManager = sseManager;
	}

	async authLink(req: Request<{ drive: DriveType }>, res: Response<string>): Promise<void> {
		const drive = req.params.drive;
		const authLink = DrivesService.getAuthLink(drive);
		authLink ? res.status(Status.OK).send(authLink) : res.status(Status.BAD_REQUEST);
	}

	async connectDrive(
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

	async getDriveQuota(
		req: Request<{ drive: DriveType; email: string }>,
		res: Response<DriveQuota, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const drive = req.params.drive;
		const driveEmail = req.params.email;

		const quota = await DrivesService.getDriveQuota(email, driveEmail, drive);

		if (quota) {
			res.status(Status.OK).send(quota);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR);
		}
	}

	async getDrives(_req: Request, res: Response<DriveEntity[], AuthLocals>): Promise<void> {
		const { email } = res.locals;
		const driveEntities = await DrivesService.getDrives(email);

		if (driveEntities) {
			res.status(Status.OK).send(driveEntities);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).send();
		}
	}

	async deleteDrive(
		req: Request<{ drive: DriveType; email: string }>,
		res: Response<void, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;
		const { drive, email: driveEmail } = req.params;
		const success = await DrivesService.deleteDrive(email, driveEmail, drive);
		const statusId = success ? Status.OK : Status.INTERNAL_SERVER_ERROR;

		res.status(statusId).send();
	}

	public async watchDrive(
		req: Request<any, any, { drive: DriveType; email: string }>,
		res: Response<WatchChangesChannel, AuthLocals>
	): Promise<void> {
		console.log('[watchdrive]');

		const { email } = res.locals;
		const { drive, email: driveEmail } = req.body;

		const watchChangesChannel = await DrivesService.subscribeForDriveChanges(
			email,
			driveEmail,
			drive
		);

		console.log({ watchChangesChannel });

		if (watchChangesChannel) {
			res.status(Status.OK).json(watchChangesChannel);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR).end();
		}
	}

	public async stopWatchDrive(
		req: Request<any, any, { drive: DriveType; email: string; id: string; resourceId: string }>,
		res: Response<any, AuthLocals>
	) {
		console.log('[stopWatchDrive]');

		const { email } = res.locals;
		const { drive, email: driveEmail } = req.body;
		const { id, resourceId } = req.body;

		console.log({ email, drive, driveEmail, id, resourceId });

		if (!id || !resourceId) {
			res.status(Status.BAD_REQUEST).send('Missing required parameters');
			return;
		}

		try {
			await DrivesService.unsubscribeForDriveChanges(
				email,
				driveEmail,
				drive,
				id,
				resourceId
			);
			res.status(Status.OK).end();
		} catch (err) {
			res.status(Status.INTERNAL_SERVER_ERROR).send((err as Error).message);
		}
	}

	public getChanges = async (
		req: Request<{ drive: DriveType; email: string }, {}, {}, { startPageToken?: string }>,
		res: Response<any, AuthLocals>
	): Promise<void> => {
		const { email: userEmail } = res.locals;
		const { email: driveEmail, drive } = req.params;
		const { startPageToken } = req.query;

		console.log('[getChangesDriveController]');
		console.log({ params: req.params, query: req.query });
		console.log({ userEmail, driveEmail, drive, startPageToken });

		if (!startPageToken) {
			res.status(Status.BAD_REQUEST).send('StartPageToken was not provided.');
			return;
		}

		try {
			const changes = await DrivesService.fetchDriveChanges(
				drive,
				userEmail,
				driveEmail,
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
		console.log('[driveSubscriptionController]');
		this.sseManager.addClient(req, res);
	};

	public driveNotification = (req: Request, res: Response): void => {
		const notificationDetails = {
			driveType: DriveType.GoogleDrive,
			driveEmail: req.headers['x-goog-channel-token'],
			change: req.headers['x-goog-resource-state'],
		};

		console.log({ notificationDetails });

		this.sseManager.sendNotification('update-event', notificationDetails);

		res.status(Status.OK).end();
	};
}

export default new DrivesController(new SseManager());
