import { Request, Response } from 'express';
import { AuthLocals } from '../../../../types/types';
import { DriveQuota, Status } from '../../../../types/global.types';
import VirtualDriveService from './drives.virtual.service';

class VirtualDriveController {
	public async getVirtualQuota(
		_req: Request,
		res: Response<DriveQuota, AuthLocals>
	): Promise<void> {
		const { email } = res.locals;

		const virtualQuota = await VirtualDriveService.getVirtualQuota(email);

		if (virtualQuota) {
			res.status(Status.OK).send(virtualQuota);
		} else {
			res.status(Status.INTERNAL_SERVER_ERROR);
		}
	}
}

export default new VirtualDriveController();
