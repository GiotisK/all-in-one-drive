import { AuthLocals, CustomRequest } from '../../../types/types';
import { registerUser, loginUser } from './user.service';
import { Response, Request } from 'express';
import { AuthUserResponse, RegisterUserRequestBody, Status } from '../../../types/global.types';

export const registerUserController = async (
	req: CustomRequest<RegisterUserRequestBody>,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;
		const isRegisterSuccessfull = await registerUser(email, password);
		const status = isRegisterSuccessfull ? Status.OK : Status.BAD_REQUEST;

		res.status(status).send();
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
		const { success, token } = await loginUser(email, password);

		if (success) {
			res.cookie('token', token, { httpOnly: true }).status(Status.OK).send();
		} else {
			res.status(Status.BAD_REQUEST).send();
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
	//TODO: handle logout
	/* try {
		const { email, password } = req.body;

		await registerUser(email, password);
		res.status(Status.OK).send();
	} catch (err) {
		console.log('ERROR::user.controllers::', err);
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	} */
};

export const authUserController = async (_req: Request, res: Response): Promise<void> => {
	const { isVerified, email } = res.locals as AuthLocals;
	const statusId = isVerified ? Status.OK : Status.UNAUTHORIZED;
	const responseData: AuthUserResponse = { email };

	res.status(statusId).send(responseData);
};
