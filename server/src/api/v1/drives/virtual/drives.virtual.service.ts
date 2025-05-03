import { bytesToGigabytes } from '../../../../helpers/helpers';
import DatabaseService from '../../../../services/database/DatabaseFactory';
import { DriveQuota, Nullable } from '../../../../types/global.types';
import { getDriveContextAndToken } from '../drives.helpers';

class VirtualDriveService {
	async getVirtualQuota(userEmail: string): Promise<Nullable<DriveQuota>> {
		const drives = await DatabaseService.getAllDrives(userEmail);

		if (!drives) {
			return null;
		}

		const quotas = await Promise.all(
			drives.map(async drive => {
				const { driveType, token: encryptedTokenAsString } = drive;
				const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenAsString);
				if (ctxAndToken) {
					const { ctx, token } = ctxAndToken;
					try {
						return await ctx.getDriveQuota(token);
					} catch (e) {
						console.error(`Failed to fetch quota for driveId: ${drive.id}`, e);
					}
				}
				return null;
			})
		);

		const total = quotas.reduce((acc, cur) => acc + (cur?.total || 0), 0);
		const used = quotas.reduce((acc, cur) => acc + (cur?.used || 0), 0);

		return { used: bytesToGigabytes('' + used), total: bytesToGigabytes('' + total) };
	}
}

export default new VirtualDriveService();
