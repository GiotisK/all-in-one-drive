import { generateUUID } from '../../helpers/helpers';
import User, { DriveSchema } from '../../models/user.model';
import { DriveType, Nullable } from '../../types/global.types';

export class DatabaseService {
	public async saveUser(email: string, password: string): Promise<boolean> {
		try {
			const user = new User({ email, password });
			const savedUserDocument = await user.save();
			return !!savedUserDocument;
		} catch {
			return false;
		}
	}

	public async getUser(email: string) {
		return User.findOne({ email }).exec();
	}

	public async saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		drive: DriveType
	): Promise<boolean> {
		try {
			const drives: DriveSchema = {
				id: generateUUID(),
				email: driveEmail,
				token: encryptedTokenData,
				driveType: drive,
			};

			const updatedUser = await User.findOneAndUpdate(
				{ email: userEmail },
				{
					$push: { drives },
				},
				{ upsert: true, new: true }
			).exec();

			return !!updatedUser;
		} catch (e) {
			return false;
		}
	}

	public async getEncryptedTokenAsString(
		userEmail: string,
		driveId: string
	): Promise<Nullable<string>> {
		try {
			const user = await User.findOne({ email: userEmail }).exec();
			if (!user) {
				return null;
			}

			const drives: DriveSchema[] | undefined = user?.drives;
			if (!drives) {
				return null;
			}

			const tokenData = drives.find(drive => drive.id === driveId);
			return tokenData?.token ?? null;
		} catch {
			return null;
		}
	}

	public async getAllDrives(userEmail: string): Promise<Nullable<DriveSchema[]>> {
		try {
			const user = await User.findOne({ email: userEmail }).exec();
			return user ? user.drives : null;
		} catch {
			return null;
		}
	}

	public async getDrive(userEmail: string, driveId: string): Promise<Nullable<DriveSchema>> {
		try {
			const user = await User.findOne({
				email: userEmail,
			}).exec();

			if (!user) {
				return null;
			}

			const foundDrive = user.drives.find(drive => drive.id === driveId);

			return foundDrive ?? null;
		} catch (e) {
			return null;
		}
	}

	public async deleteDrive(userEmail: string, driveId: string) {
		try {
			const result = await User.updateOne(
				{ email: userEmail },
				{ $pull: { drives: { _id: driveId } } }
			).exec();

			return result.modifiedCount > 0;
		} catch {
			return null;
		}
	}
}

export default new DatabaseService();
