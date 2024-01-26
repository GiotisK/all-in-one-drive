import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FilesState } from './types';
import { FileEntity } from '../../../shared/types/global.types';

const initialState: FilesState = {
	files: [],
};

const filesSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {
		setFiles: (state: FilesState, { payload: files }: PayloadAction<FileEntity[]>) => {
			state.files = files;
		},
		deleteFile: (state: FilesState, { payload: fileId }: PayloadAction<string>) => {
			state.files = state.files.filter(file => file.id !== fileId);
		},
	},
});

export const { setFiles, deleteFile } = filesSlice.actions;

export default filesSlice.reducer;
