import { Entity, FileType, MultimediaType, ThemeMode } from '../shared/types/types';
import store from './store/store';

export interface SettingsState {
	themeMode: ThemeMode;
}

export interface UserState {
	isAuthenticated: boolean;
	email: string;
}

export type AddDriveModalState = {
	visible: boolean;
};

export type DeleteModalState = {
	visible: boolean;
	entity: Entity | null;
};

export type ExportFormatModalState = {
	visible: boolean;
	exportFormats: string[];
};

export type MultimediaModalState = {
	visible: boolean;
	multimediaType: MultimediaType | null;
};

export type RenameModalState = {
	visible: boolean;
};

export type UploadModalState = {
	visible: boolean;
	fileType: FileType | null;
};

export interface ModalState {
	addDriveModal: AddDriveModalState;
	deleteModal: DeleteModalState;
	exportFormatModal: ExportFormatModalState;
	multimediaModal: MultimediaModalState;
	renameModal: RenameModalState;
	uploadModal: UploadModalState;
}

export type RootState = ReturnType<typeof store.getState>;
