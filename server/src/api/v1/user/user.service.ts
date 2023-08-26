import User from '../../../models/user.model'; //TODO: alias??

export const registerUser = async (email: string, password: string) => {
	const user = new User({ email, password });

	return user.save();
};
