import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../services/user.service';
import { RootState } from '../store/store';
import { unsubscribeForChanges } from './drives.async.actions';

type LoginUserParams = { email: string; password: string };
export const loginUser = createAsyncThunk(
	'user/login',
	async ({ email, password }: LoginUserParams) => {
		await UserService.loginUser(email, password);
	}
);

export const logoutUser = createAsyncThunk<void, undefined, { state: RootState }>(
	'user/logout',
	async (_, { dispatch, getState }) => {
		const { drives } = getState().drives;

		await Promise.all(
			drives.map(async ({ email, type, watchChangesChannel }) => {
				if (!watchChangesChannel) {
					return;
				}

				const { id, resourceId } = watchChangesChannel;
				await dispatch(unsubscribeForChanges({ email, drive: type, id, resourceId }));
			})
		);

		console.log('Sending logout request');
		await UserService.logoutUser();
	}
);

export const authorizeUser = createAsyncThunk('user/authorize', async () => {
	const email = await UserService.authorizeUser();
	return email;
});
