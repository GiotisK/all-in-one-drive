import { FileEntity, FileType, Nullable } from '../../../shared/types/global.types';
import { Entity, MultiMediaType } from '../../../shared/types/types';

export type DeleteModalState = {
	entity: Nullable<Entity>;
};

export type ExportFormatModalState = {
	exportFormats: string[];
};

export type MultimediaModalState = {
	multiMediaType: Nullable<MultiMediaType>;
};

export type RenameModalState = {
	entity: Nullable<FileEntity>;
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
	| { kind: ModalKind.Rename; state: RenameModalState }
	| { kind: ModalKind.Upload; state: UploadModalState };

export interface ModalState {
	modal: Nullable<Modal>;
}
