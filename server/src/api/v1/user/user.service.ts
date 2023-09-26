import User from '../../../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isAcceptablePasswordLength, isEmailFormat } from './user.helpers';

export const registerUser = async (email: string, password: string): Promise<boolean> => {
	const arePasswordAndEmailAcceptable =
		isEmailFormat(email) && isAcceptablePasswordLength(password);
	if (!arePasswordAndEmailAcceptable) {
		return false;
	}
	const saltRounds = parseInt(process.env.SALT_ROUNDS!);
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const user = new User({ email, password: hashedPassword });
	const savedUserDocument = await user.save();

	return !!savedUserDocument;
};

type LoginServiceData = {
	success: boolean;
	token: string;
};
export const loginUser = async (email: string, password: string): Promise<LoginServiceData> => {
	const user = await User.findOne({ email });

	if (user && user.password) {
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (isPasswordCorrect) {
			const secret = process.env.JWT_SECRET!;
			const payload = { email };
			const token = jwt.sign(payload, secret, {
				expiresIn: process.env.TOKEN_EXPIRATION!,
			});
			return { success: true, token: token };
		}
	}
	return { success: false, token: '' };
};
