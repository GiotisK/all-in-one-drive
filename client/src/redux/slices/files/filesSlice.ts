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
	},
});

export const { setFiles } = filesSlice.actions;

export default filesSlice.reducer;
