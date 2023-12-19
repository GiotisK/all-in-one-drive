import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import settingsReducer from '../slices/settingsSlice';

const store = configureStore({
	reducer: {
		settings: settingsReducer,
		user: userReducer,
	},
});

export default store;
