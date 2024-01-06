import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Modal, ModalState } from '../types';

const initialState: ModalState = {
	modal: null,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal: (state: ModalState, { payload }: PayloadAction<Modal>) => {
			state.modal = payload;
		},
		closeModals: (): ModalState => initialState,
	},
});

export const { openModal, closeModals } = modalSlice.actions;

export default modalSlice.reducer;
