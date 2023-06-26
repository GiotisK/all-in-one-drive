import { registerUser } from './user.service';

export const registerUserController = async (req: Request, res: Response) => {
	try {
		console.log('register user controller');
		await registerUser();
	} catch (err) {}
};
