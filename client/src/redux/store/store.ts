import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import settingsReducer from '../slices/settingsSlice';
import modalReducer from '../slices/modalSlice';

const store = configureStore({
	reducer: {
		settings: settingsReducer,
		user: userReducer,
		modal: modalReducer,
	},
});

export default store;
