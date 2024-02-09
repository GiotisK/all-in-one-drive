import User, { DriveSchema } from '../../models/user.model';
import { DriveType, Nullable } from '../../types/global.types';
import { v4 as generateUuid } from 'uuid';

export const saveUser = async (email: string, password: string) => {
	try {
		const user = new User({ email, password });
		const savedUserDocument = await user.save();
		return !!savedUserDocument;
	} catch {
		return false;
	}
};

export const getUser = async (email: string) => {
	return User.findOne({ email }).exec();
};

export const saveDriveProperties = async (
	encryptedTokenData: string,
	driveEmail: string,
	userEmail: string,
	drive: DriveType
): Promise<boolean> => {
	try {
		const driveProperties: DriveSchema = {
			id: generateUuid(),
			email: driveEmail,
			token: encryptedTokenData,
			driveType: drive,
		};

		const updatedUser = await User.findOneAndUpdate(
			{ email: userEmail },
			{
				$set: { drives: driveProperties },
			},
			{ upsert: true, new: true }
		).exec();

		return !!updatedUser;
	} catch (e) {
		return false;
	}
};

export const getEncryptedTokenAsString = async (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
): Promise<Nullable<string>> => {
	try {
		const user = await User.findOne({ email: userEmail }).exec();
		const driveProperties: DriveSchema[] | undefined = user?.drives;

		if (user && driveProperties) {
			const tokenData = driveProperties.find(
				properties => properties.email === driveEmail && properties.driveType === drive
			);
			return tokenData?.token ?? null;
		}
		return null;
	} catch {
		return null;
	}
};

export const getAllDrives = async (userEmail: string): Promise<Nullable<DriveSchema[]>> => {
	try {
		const user = await User.findOne({ email: userEmail }).exec();
		return user ? user.drives : null;
	} catch {
		return null;
	}
};

export const getDrive = async (
	userEmail: string,
	driveEmail: string,
	driveType: DriveType
): Promise<Nullable<DriveSchema>> => {
	try {
		const user = await User.findOne({
			email: userEmail,
		}).exec();

		const foundDrive = user?.drives.find(
			drive => drive.email === driveEmail && drive.driveType === driveType
		);

		return foundDrive ?? null;
	} catch (e) {
		return null;
	}
};

export const deleteDriveProperties = async (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
) => {
	try {
		const result = await User.updateOne(
			{ email: userEmail },
			{ $pull: { drives: { email: driveEmail, driveType: drive } } }
		).exec();

		return result.modifiedCount > 0;
	} catch {
		return null;
	}
};
