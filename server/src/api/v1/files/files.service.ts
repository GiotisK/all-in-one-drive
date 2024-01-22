import { getDriveProperties } from '../../../services/database/mongodb.service';
import DriveContext from '../../../services/drive/DriveContext';
import { EncryptedData, decrypt } from '../../../services/encryption/encryption.service';
import { FileEntity, Nullable } from '../../../types/global.types';
import { getDriveStrategyFromString } from '../drives/drive.helpers';

export const getRootFiles = async (userEmail: string): Promise<Nullable<FileEntity[]>> => {
	const fileEntities: Array<FileEntity[]> = [];
	const driveProperties = await getDriveProperties(userEmail);

	if (driveProperties) {
		const promiseArr: Promise<Nullable<FileEntity[]>>[] = [];

		try {
			driveProperties.forEach(async properties => {
				const { token: encryptedTokenStr, driveType } = properties;
				const driveStrategy = getDriveStrategyFromString(driveType);

				if (driveStrategy) {
					const encryptedToken = JSON.parse(encryptedTokenStr) as EncryptedData;
					const token = decrypt(encryptedToken);

					const ctx = new DriveContext(driveStrategy);
					promiseArr.push(ctx.getDriveFiles(token));
				}
			});

			const fileEntityLists = await Promise.all(promiseArr);

			fileEntityLists.forEach(list => {
				if (list) {
					fileEntities.push(list);
				}
			});

			return fileEntities.flat() ?? null;
		} catch {
			return null;
		}
	}

	return null;
};
