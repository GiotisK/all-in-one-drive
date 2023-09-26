import {
	LoginUserRequestBody,
	RegisterUserRequestBody,
	Status,
} from '../shared/types/global.types';
import { postRequest } from './request.service';

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
