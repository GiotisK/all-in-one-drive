import {
	AuthUserResponse,
	LoginUserRequestBody,
	RegisterUserRequestBody,
	Status,
} from '../shared/types/global.types';
import RequestService from './request.service';

export class UserService {
	async registerUser(email: string, password: string): Promise<boolean> {
		const res = await RequestService.post<RegisterUserRequestBody, void>('/users/register', {
			email,
			password,
		});
		return res.status === Status.OK;
	}

	async loginUser(email: string, password: string): Promise<boolean> {
		const res = await RequestService.post<LoginUserRequestBody, void>('/users/login', {
			email,
			password,
		});
		return res.status === Status.OK;
	}

	async logoutUser(): Promise<boolean> {
		const res = await RequestService.get('/users/logout');
		return res.status === Status.OK;
	}

	async authorizeUser(): Promise<string> {
		const res = await RequestService.get<AuthUserResponse>('/users/auth');
		const { email } = res.data;
		return email;
	}
}

export default new UserService();
