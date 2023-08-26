import { CustomRequest } from '../../../types/types';
import { registerUser } from './user.service';
import { Response } from 'express';
import { RegisterUserRequestBody, Status } from '../../../types/global.types';

export const registerUserController = async (
	req: CustomRequest<RegisterUserRequestBody>,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;
		await registerUser(email, password);
		res.status(Status.OK).send();
	} catch (err) {
		console.log('ERROR::user.controllers::', err);
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};
