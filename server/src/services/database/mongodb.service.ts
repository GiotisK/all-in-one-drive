import User from '../../models/user.model';
import { DriveType } from '../../types/global.types';

export const saveDriveProperties = async (
	encryptedTokenData: string,
	driveEmail: string,
	userEmail: string,
	drive: DriveType
): Promise<boolean> => {
	try {
		const driveProperties = { email: driveEmail, token: encryptedTokenData };
		const updatedUser = await User.findOneAndUpdate(
			{ email: userEmail },
			{
				$push: { [drive]: driveProperties },
			}
		).exec();

		return !!updatedUser;
	} catch {
		return false;
	}
};
