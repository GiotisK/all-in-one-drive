import { ThemeMode } from '../shared/types/types';
import store from './store/store';

export interface SettingsState {
	themeMode: ThemeMode;
}

export interface UserState {
	isAuthenticated: boolean;
	email: string;
}

export type RootState = ReturnType<typeof store.getState>;
