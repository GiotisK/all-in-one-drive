import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as login, logoutUser as logout, authUser } from '../../services/user.service';

type LoginUserParams = { email: string; password: string };
export const loginUser = createAsyncThunk(
	'user/login',
	async ({ email, password }: LoginUserParams) => {
		await login(email, password);
	}
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
	await logout();
});

export const authorizeUser = createAsyncThunk('user/authorize', async () => {
	const email = await authUser();
	return email;
});
