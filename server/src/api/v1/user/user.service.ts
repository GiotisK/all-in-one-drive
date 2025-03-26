import { isAcceptablePasswordLength, isEmailFormat } from './user.helpers';
import EncryptionService from '../../../services/encryption/encryption.service';
import DatabaseService from '../../../services/database/DatabaseFactory';

export class UserService {
	async registerUser(email: string, password: string): Promise<boolean> {
		const arePasswordAndEmailAcceptable =
			isEmailFormat(email) && isAcceptablePasswordLength(password);

		if (!arePasswordAndEmailAcceptable) {
			return false;
		}

		const hashedPassword = await EncryptionService.hashPassword(password);
		const userSaveSuccess = await DatabaseService.saveUser(email, hashedPassword);

		return userSaveSuccess;
	}

	async loginUser(
		email: string,
		password: string
	): Promise<{ success: boolean; token: string; email: string }> {
		const user = await DatabaseService.getUser(email);

		if (user && user.password) {
			const isPasswordCorrect = await EncryptionService.comparePasswordWithHash(
				password,
				user.password
			);

			if (isPasswordCorrect) {
				const token = EncryptionService.generateJsonWebToken(email);
				return { success: true, token, email };
			}
		}

		return { success: false, token: '', email: '' };
	}
}

export default new UserService();
