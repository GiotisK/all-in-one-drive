import { generateUUID } from '../../helpers/helpers';
import User, { DriveSchema } from '../../models/user.model';
import { DriveType, Nullable } from '../../types/global.types';

export class DatabaseService {
	async saveUser(email: string, password: string): Promise<boolean> {
		try {
			const user = new User({ email, password });
			const savedUserDocument = await user.save();
			return !!savedUserDocument;
		} catch {
			return false;
		}
	}

	async getUser(email: string) {
		return User.findOne({ email }).exec();
	}

	async saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		drive: DriveType
	): Promise<boolean> {
		try {
			const driveProperties: DriveSchema = {
				id: generateUUID(),
				email: driveEmail,
				token: encryptedTokenData,
				driveType: drive,
			};

			const updatedUser = await User.findOneAndUpdate(
				{ email: userEmail },
				{
					$push: { drives: driveProperties },
				},
				{ upsert: true, new: true }
			).exec();

			return !!updatedUser;
		} catch (e) {
			return false;
		}
	}

	async getEncryptedTokenAsString(userEmail: string, driveId: string): Promise<Nullable<string>> {
		try {
			const user = await User.findOne({ email: userEmail }).exec();
			const drives: DriveSchema[] | undefined = user?.drives;

			if (user && drives) {
				const tokenData = drives.find(drive => drive.id === driveId);
				return tokenData?.token ?? null;
			}
			return null;
		} catch {
			return null;
		}
	}

	async getAllDrives(userEmail: string): Promise<Nullable<DriveSchema[]>> {
		try {
			const user = await User.findOne({ email: userEmail }).exec();
			return user ? user.drives : null;
		} catch {
			return null;
		}
	}

	async getDrive(userEmail: string, driveId: string): Promise<Nullable<DriveSchema>> {
		try {
			const user = await User.findOne({
				email: userEmail,
			}).exec();

			const foundDrive = user?.drives.find(drive => drive.id === driveId);

			return foundDrive ?? null;
		} catch (e) {
			return null;
		}
	}

	async deleteDrive(userEmail: string, driveId: string) {
		try {
			const result = await User.updateOne(
				{ email: userEmail },
				{ $pull: { drives: { id: driveId } } }
			).exec();

			return result.modifiedCount > 0;
		} catch {
			return null;
		}
	}
}

export default new DatabaseService();
