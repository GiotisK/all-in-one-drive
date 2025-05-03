import { createSlice } from '@reduxjs/toolkit';
import { ThemeMode } from '../../../shared/types/types';
import { SettingsState } from './types';

const initialState: SettingsState = {
	themeMode: (localStorage.getItem('theme') as ThemeMode) ?? 'light',
	isVirtualDriveEnabled: localStorage.getItem('isVirtualDriveEnabled') ? true : false,
};

const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		toggleTheme: (state: SettingsState) => {
			state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
		},
		toggleDriveMode: (state: SettingsState) => {
			state.isVirtualDriveEnabled = !state.isVirtualDriveEnabled;
		},
	},
});

export const { toggleTheme, toggleDriveMode } = settingsSlice.actions;
export default settingsSlice.reducer;
