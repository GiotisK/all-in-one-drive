import { CustomRequest } from '@types';
import { registerUser } from './user.service';
import { Response } from 'express';
import { RegisterUserRequestBody } from '@globaltypes';

export const registerUserController = async (
	req: CustomRequest<RegisterUserRequestBody>,
	res: Response
) => {
	try {
		const { email, password } = req.body;
		await registerUser(email, password);
	} catch (err) {}
};
