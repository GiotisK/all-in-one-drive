import { createSlice } from '@reduxjs/toolkit';
import { UserState } from './types';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';
import { authorizeUser, loginUser, logoutUser } from '../../async-actions/user.async.actions';

const initialState: UserState = {
	isAuthenticated: false,
	email: '',
	requests: {
		authorize: requestInitialState,
		login: requestInitialState,
		logout: requestInitialState,
	},
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(loginUser.pending, state => {
				state.requests.login = requestPendingState;
			})
			.addCase(loginUser.fulfilled, state => {
				state.requests.login = requestSuccessState;
			})
			.addCase(loginUser.rejected, state => {
				state.requests.login = requestErrorState;
			});
		builder
			.addCase(logoutUser.pending, state => {
				state.requests.login = requestPendingState;
			})
			.addCase(logoutUser.fulfilled, () => {
				return initialState;
			})
			.addCase(logoutUser.rejected, state => {
				state.requests.logout = requestErrorState;
			});
		builder
			.addCase(authorizeUser.pending, state => {
				state.requests.authorize = requestPendingState;
			})
			.addCase(authorizeUser.fulfilled, (state, { payload: email }) => {
				state.isAuthenticated = true;
				state.email = email;
				state.requests.authorize = requestSuccessState;
			})
			.addCase(authorizeUser.rejected, state => {
				state.requests.authorize = requestErrorState;
			});
	},
});

export default userSlice.reducer;
