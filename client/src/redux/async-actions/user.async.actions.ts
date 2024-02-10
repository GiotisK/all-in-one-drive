import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../services/user.service';

type LoginUserParams = { email: string; password: string };
export const loginUser = createAsyncThunk(
	'user/login',
	async ({ email, password }: LoginUserParams) => {
		await UserService.loginUser(email, password);
	}
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
	await UserService.logoutUser();
});

export const authorizeUser = createAsyncThunk('user/authorize', async () => {
	const email = await UserService.authorizeUser();
	return email;
});
