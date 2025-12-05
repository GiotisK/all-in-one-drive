import { IUserRepository } from '../../interface/IUserRepository';
import { User } from '../schema/User';

export class MongoDBUserRepository implements IUserRepository {
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
}
