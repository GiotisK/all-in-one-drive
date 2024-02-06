import { isAcceptablePasswordLength, isEmailFormat } from './user.helpers';
import {
	comparePasswordWithHash,
	generateJsonWebToken,
	hashPassword,
} from '../../../services/encryption/encryption.service';
import { getUser, saveUser } from '../../../services/database/mongodb.service';

export const registerUser = async (email: string, password: string): Promise<boolean> => {
	const arePasswordAndEmailAcceptable =
		isEmailFormat(email) && isAcceptablePasswordLength(password);
	if (!arePasswordAndEmailAcceptable) {
		return false;
	}
	const hashedPassword = await hashPassword(password);
	const userSaveSuccess = await saveUser(email, hashedPassword);
	return userSaveSuccess;
};

type LoginServiceData = {
	success: boolean;
	token: string;
};
export const loginUser = async (email: string, password: string): Promise<LoginServiceData> => {
	const user = await getUser(email);
	if (user && user.password) {
		const isPasswordCorrect = await comparePasswordWithHash(password, user.password);
		if (isPasswordCorrect) {
			const token = generateJsonWebToken(email);
			return { success: true, token: token };
		}
	}
	return { success: false, token: '' };
};
