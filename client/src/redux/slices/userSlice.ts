import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../types';

const initialState: UserState = {
	isAuthenticated: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsAuthenticated: (state: UserState) => {
			state.isAuthenticated = false;
		},
	},
});

export const { setIsAuthenticated } = userSlice.actions;
export default userSlice.reducer;
