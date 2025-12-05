import { DriveType, Nullable } from '../../../../types/global.types';
import { IDriveRepository } from '../../interface/IDriveRepository';
import { DriveDTO } from '../../types';
import { User } from '../schema/User';

export class MongoDBDriveRepository implements IDriveRepository {
	public async saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		driveType: DriveType,
		driveId: string,
		virtualFolderId: string
	): Promise<boolean> {
		try {
			const drive = {
				_id: driveId,
				email: driveEmail,
				token: encryptedTokenData,
				driveType,
				virtualFolderId,
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

	public async checkDriveExistance(
		userEmail: string,
		driveEmail: string,
		driveType: DriveType
	): Promise<boolean> {
		try {
			const user = await User.findOne({
				email: userEmail,
			}).exec();

			if (!user) {
				return false;
			}

			const foundDrive = user.drives.find(
				drive => drive.email === driveEmail && drive.driveType === driveType
			);

			return !!foundDrive;
		} catch (e) {
			return false;
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
