import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
	AddDriveModalState,
	DeleteModalState,
	ExportFormatModalState,
	ModalState,
	MultimediaModalState,
	RenameModalState,
	UploadModalState,
} from '../types';

const initialState: ModalState = {
	addDriveModal: {
		visible: false,
	},
	deleteModal: {
		visible: false,
		entity: null,
	},
	exportFormatModal: {
		visible: false,
		exportFormats: [],
	},
	multimediaModal: {
		visible: false,
		multimediaType: null,
	},
	renameModal: {
		visible: false,
	},
	uploadModal: {
		visible: false,
		fileType: null,
	},
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		showAddDriveModal: (state: ModalState, { payload }: PayloadAction<AddDriveModalState>) => {
			state.addDriveModal = payload;
		},
		showDeleteModal: (state: ModalState, { payload }: PayloadAction<DeleteModalState>) => {
			state.deleteModal = payload;
		},
		showExportFormatModal: (
			state: ModalState,
			{ payload }: PayloadAction<ExportFormatModalState>
		) => {
			state.exportFormatModal = payload;
		},
		showMultimediaModal: (
			state: ModalState,
			{ payload }: PayloadAction<MultimediaModalState>
		) => {
			state.multimediaModal = payload;
		},
		showRenameModal: (state: ModalState, { payload }: PayloadAction<RenameModalState>) => {
			state.renameModal = payload;
		},
		showUploadModal: (state: ModalState, { payload }: PayloadAction<UploadModalState>) => {
			state.uploadModal = payload;
		},
		closeModals: (): ModalState => {
			return initialState;
		},
	},
});

export const {
	showAddDriveModal,
	showDeleteModal,
	showExportFormatModal,
	showRenameModal,
	showMultimediaModal,
	showUploadModal,
	closeModals,
} = modalSlice.actions;
export default modalSlice.reducer;
