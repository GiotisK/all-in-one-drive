import User from '../../../models/user.model';
import bcrypt from 'bcryptjs';

export const registerUser = async (email: string, password: string): Promise<unknown> => {
	const saltRounds = parseInt(process.env.SALT_ROUNDS!);
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const user = new User({ email, password: hashedPassword });

	return user.save();
};

export const loginUser = async (email: string, password: string) => {
	const user = await User.findOne({ email });

	if (user && user.password) {
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		return isPasswordCorrect;
	} else {
		return false;
	}
};
