import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user/userSlice';
import settingsReducer from '../slices/settings/settingsSlice';
import modalReducer from '../slices/modal/modalSlice';
import drivesReducer from '../slices/drives/drivesSlice';
import filesReducer from '../slices/files/filesSlice';

const store = configureStore({
	reducer: {
		settings: settingsReducer,
		user: userReducer,
		modal: modalReducer,
		drives: drivesReducer,
		files: filesReducer,
	},
});

export default store;
