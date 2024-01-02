import User, { DriveSchema } from '../../models/user.model';
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

export const getEncryptedTokenAsString = async (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
): Promise<string | null> => {
	try {
		const user = await User.findOne({ email: userEmail }).exec();
		const driveProperties: DriveSchema[] | undefined = user?.[drive];

		if (user && driveProperties) {
			const tokenData = driveProperties.find(properties => properties.email === driveEmail);
			return tokenData?.token ?? null;
		}
		return null;
	} catch {
		return null;
	}
};
