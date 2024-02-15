import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user/userSlice';
import settingsReducer from '../slices/settings/settingsSlice';
import modalReducer from '../slices/modal/modalSlice';
import drivesReducer from '../slices/drives/drivesSlice';
import filesReducer from '../slices/files/filesSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
	reducer: {
		settings: settingsReducer,
		user: userReducer,
		modal: modalReducer,
		drives: drivesReducer,
		files: filesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
