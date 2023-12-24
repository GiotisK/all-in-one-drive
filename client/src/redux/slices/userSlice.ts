import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserState } from '../types';

const initialState: UserState = {
	isAuthenticated: false,
	email: '',
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		//TODO: use async thunks instead for better handling
		setIsAuthenticated: (state: UserState, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload;
		},
		setEmail: (state: UserState, action: PayloadAction<string>) => {
			state.email = action.payload;
		},
	},
});

export const { setIsAuthenticated, setEmail } = userSlice.actions;
export default userSlice.reducer;
