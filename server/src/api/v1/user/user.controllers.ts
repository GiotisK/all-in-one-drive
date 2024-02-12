import { AuthLocals } from '../../../types/types';
import UserService from './user.service';
import { Response, Request } from 'express';
import { AuthUserResponse, RegisterUserRequestBody, Status } from '../../../types/global.types';

class UserController {
	async registerUser(
		req: Request<void, void, RegisterUserRequestBody>,
		res: Response
	): Promise<void> {
		try {
			const { email, password } = req.body;
			const isRegisterSuccessful = await UserService.registerUser(email, password);
			const status = isRegisterSuccessful ? Status.OK : Status.BAD_REQUEST;

			res.status(status).send();
		} catch (err) {
			console.log('ERROR:user.controllers:registerUser:', err);
			res.status(Status.INTERNAL_SERVER_ERROR).send();
		}
	}

	async loginUser(
		req: Request<void, void, RegisterUserRequestBody>,
		res: Response
	): Promise<void> {
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
	}

	async logoutUser(req: Request, res: Response): Promise<void> {
		res.clearCookie('token').status(Status.OK).send();
	}

	async authUser(req: Request, res: Response<AuthUserResponse, AuthLocals>): Promise<void> {
		const { email } = res.locals;
		res.status(Status.OK).send({ email });
	}
}

export default new UserController();
