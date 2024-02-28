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
			drives.map(async ({ id: driveId, watchChangesChannel }) => {
				if (!watchChangesChannel) {
					return;
				}
				//TODO: improve "id" var name to something more descriptive
				const { id, resourceId } = watchChangesChannel;
				await dispatch(unsubscribeForChanges({ driveId, id, resourceId }));
			})
		);

		await UserService.logoutUser();
	}
);

export const authorizeUser = createAsyncThunk('user/authorize', async () => {
	const email = await UserService.authorizeUser();
	return email;
});
