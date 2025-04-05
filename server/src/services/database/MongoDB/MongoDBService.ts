import mongoose from 'mongoose';
import { DriveType, Nullable } from '../../../types/global.types';
import { IDatabaseService } from '../IDatabaseService';
import { DriveDTO, UserDTO } from '../types';

type MongoDBUserSchema = UserDTO & { drives: DriveDTO[] };

const userSchema = new mongoose.Schema<MongoDBUserSchema>({
	email: { type: String, required: true, unique: true },
	password: { type: String },
	drives: [
		{
			_id: String,
			email: String,
			virtualFolderId: { type: String, default: '' },
			token: String,
			driveType: String,
		},
	],
});

const User = mongoose.model<MongoDBUserSchema>('User', userSchema);

export class MongoDBService implements IDatabaseService {
	public async connect() {
		try {
			await mongoose.connect(process.env.MONGO_URI!);
			console.log('[database]: MongoDB is now connected');
		} catch (error: any) {
			console.log(error.message);
			process.exit(1);
		}
	}

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
		try {
			const user = await User.findOne({ email }).exec();
			if (!user) return null;

			return user;
		} catch {
			return null;
		}
	}

	public async saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		driveType: DriveType,
		driveId: string
	): Promise<boolean> {
		try {
			const drive = {
				_id: driveId,
				email: driveEmail,
				token: encryptedTokenData,
				driveType: driveType,
			};

			const updatedUser = await User.findOneAndUpdate(
				{ email: userEmail },
				{
					$push: { drives: drive },
				},
				{ upsert: true, new: true }
			).exec();

			return !!updatedUser;
		} catch (e) {
			return false;
		}
	}

	public async getAllDrives(userEmail: string): Promise<Nullable<DriveDTO[]>> {
		try {
			const user = await User.findOne({ email: userEmail }).exec();
			return user ? user.drives : null;
		} catch {
			return null;
		}
	}

	public async getDrive(userEmail: string, driveId: string): Promise<Nullable<DriveDTO>> {
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
			return false;
		}
	}

	public async updateToken(driveId: string, encryptedTokenData: string): Promise<boolean> {
		try {
			const updatedUser = await User.findOneAndUpdate(
				{ 'drives._id': driveId }, // Find the user where the drive's _id matches the driveId
				{
					$set: { 'drives.$.token': encryptedTokenData },
				},
				{ new: true }
			).exec();

			if (updatedUser) {
				console.log('Token updated successfully:', updatedUser);
				return true;
			} else {
				console.log('Drive not found');
				return false;
			}
		} catch (error) {
			console.error('Error updating token:', error);
			return false;
		}
	}
}
