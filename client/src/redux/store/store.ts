import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user/userSlice';
import settingsReducer from '../slices/settings/settingsSlice';
import modalReducer from '../slices/modal/modalSlice';
import drivesReducer from '../slices/drives/drivesSlice';

const store = configureStore({
	reducer: {
		settings: settingsReducer,
		user: userReducer,
		modal: modalReducer,
		drives: drivesReducer,
	},
});

export default store;
