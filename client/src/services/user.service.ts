import {
	AuthUserResponse,
	LoginUserRequestBody,
	RegisterUserRequestBody,
	Status,
} from '../shared/types/global.types';
import { getRequest, postRequest } from './request.service';

export const registerUser = async (email: string, password: string): Promise<boolean> => {
	const res = await postRequest<RegisterUserRequestBody, void>('/users/register', {
		email,
		password,
	});
	return res.status === Status.OK;
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
	const res = await postRequest<LoginUserRequestBody, void>('/users/login', {
		email,
		password,
	});
	return res.status === Status.OK;
};

export const logoutUser = async (): Promise<boolean> => {
	const res = await getRequest('/users/logout');
	return res.status === Status.OK;
};

export const authUser = async (): Promise<string> => {
	const res = await getRequest<AuthUserResponse>('/users/auth');
	const { email } = res.data;

	return email;
};
