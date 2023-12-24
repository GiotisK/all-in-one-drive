import {
	AuthUserResponse,
	LoginUserRequestBody,
	RegisterUserRequestBody,
	Status,
} from '../shared/types/global.types';
import { EmptyBody } from '../shared/types/types';
import { getRequest, postRequest } from './request.service';

export const registerUser = async (email: string, password: string): Promise<boolean> => {
	try {
		const res = await postRequest<RegisterUserRequestBody>('/users/register', {
			email,
			password,
		});

		return res.status === Status.OK;
	} catch {
		return false;
	}
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
	try {
		const res = await postRequest<LoginUserRequestBody>('/users/login', { email, password });

		return res.status === Status.OK;
	} catch {
		return false;
	}
};

export const logoutUser = async (): Promise<boolean> => {
	try {
		const res = await getRequest('/users/logout');

		return res.status === Status.OK;
	} catch {
		return false;
	}
};

type AuthUserReturn = { fulfilled: boolean; email: string };
export const authUser = async (): Promise<AuthUserReturn> => {
	try {
		const res = await getRequest<EmptyBody, AuthUserResponse>('/users/auth');
		const { email } = res.data;

		return { fulfilled: res.status === Status.OK, email };
	} catch {
		return { fulfilled: false, email: '' };
	}
};
