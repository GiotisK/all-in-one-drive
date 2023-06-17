import { ThemeMode } from "../shared/types/types";
import store from "./store/store";

export interface SettingsState {
	themeMode: ThemeMode;
}

export type RootState = ReturnType<typeof store.getState>;
