import { AuthLocals } from '../../../types/types';
import UserService from './user.service';
import { Response, Request } from 'express';
import { AuthUserResponse, RegisterUserRequestBody, Status } from '../../../types/global.types';

export const registerUserController = async (
	req: Request<void, void, RegisterUserRequestBody>,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;
		const isRegisterSuccessfull = await UserService.registerUser(email, password);
		const status = isRegisterSuccessfull ? Status.OK : Status.BAD_REQUEST;

		res.status(status).send();
	} catch (err) {
		console.log('ERROR:user.controllers:registerUserController:', err);
		res.status(Status.INTERNAL_SERVER_ERROR).send();
	}
};

export const loginUserController = async (
	req: Request<void, void, RegisterUserRequestBody>,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;
		const { success, token } = await UserService.loginUser(email, password);

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

export const logoutUserController = async (_req: Request, res: Response): Promise<void> => {
	res.clearCookie('token').status(Status.OK).send();
};

export const authUserController = async (
	_req: Request,
	res: Response<AuthUserResponse, AuthLocals>
): Promise<void> => {
	const { email } = res.locals;
	res.status(Status.OK).send({ email });
};
