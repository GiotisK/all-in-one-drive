import { Entity, FileType, MultiMediaType, ThemeMode } from '../shared/types/types';
import { Nullable } from '../shared/types/utils.types';
import store from './store/store';

export interface SettingsState {
	themeMode: ThemeMode;
}

export interface UserState {
	isAuthenticated: boolean;
	email: string;
}

export type DeleteModalState = {
	entity: Nullable<Entity>;
};

export type ExportFormatModalState = {
	exportFormats: string[];
};

export type MultimediaModalState = {
	multiMediaType: Nullable<MultiMediaType>;
};

export type UploadModalState = {
	fileType: Nullable<FileType>;
};

export enum ModalKind {
	AddDrive,
	Delete,
	ExportFormat,
	MultiMedia,
	Rename,
	Upload,
}

export type Modal =
	| { kind: ModalKind.AddDrive }
	| { kind: ModalKind.Delete; state: DeleteModalState }
	| { kind: ModalKind.ExportFormat; state: ExportFormatModalState }
	| { kind: ModalKind.MultiMedia; state: MultimediaModalState }
	| { kind: ModalKind.Rename }
	| { kind: ModalKind.Upload; state: UploadModalState };

export interface ModalState {
	modal: Nullable<Modal>;
}

export type RootState = ReturnType<typeof store.getState>;
