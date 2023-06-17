import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState } from "../types";

const initialState: SettingsState = {
	themeMode: "light",
};

const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		toggleTheme: (state: SettingsState) => {
			state.themeMode = state.themeMode === "light" ? "dark" : "light";
		},
	},
});

export const { toggleTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
