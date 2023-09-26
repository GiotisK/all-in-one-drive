import { CustomRequest } from '../../../types/types';
import { registerUser, loginUser } from './user.service';
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
		console.log('ERROR:user.controllers:registerUserController:', err);
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};

export const loginUserController = async (
	req: CustomRequest<RegisterUserRequestBody>,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;
		const isLoginSuccessfull = await loginUser(email, password);

		if (isLoginSuccessfull) {
			res.status(Status.OK).send();
		} else {
			res.status(Status.UNAUTHORIZED).send();
		}
	} catch (err) {
		console.log('ERROR:user.controllers:loginUserController:', err);
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};

export const logoutUserController = async (
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
