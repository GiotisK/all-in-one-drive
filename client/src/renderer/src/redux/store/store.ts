import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user/userSlice';
import settingsReducer from '../slices/settings/settingsSlice';
import modalReducer from '../slices/modal/modalSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { driveApi } from '../rtk/driveApi';
import { userApi } from '../rtk/userApi';

const store = configureStore({
	reducer: {
		settings: settingsReducer,
		user: userReducer,
		modal: modalReducer,
		[driveApi.reducerPath]: driveApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({ serializableCheck: false }).concat(
			driveApi.middleware,
			userApi.middleware
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
