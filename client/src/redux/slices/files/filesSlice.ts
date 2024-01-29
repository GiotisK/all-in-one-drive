import { createSlice } from '@reduxjs/toolkit';
import { FilesState } from './types';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';
import { deleteFile, getFiles } from '../../async-actions/files.async.actions';

const initialState: FilesState = {
	files: [],
	requests: {
		getFiles: requestInitialState,
		deleteFile: requestInitialState,
	},
};

const filesSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(getFiles.pending, state => {
				state.requests.getFiles = requestPendingState;
			})
			.addCase(getFiles.fulfilled, (state, { payload: files }) => {
				state.files = files;
				state.requests.getFiles = requestSuccessState;
			})
			.addCase(getFiles.rejected, state => {
				state.requests.getFiles = requestErrorState;
			});
		builder
			.addCase(deleteFile.pending, state => {
				state.requests.deleteFile = requestPendingState;
			})
			.addCase(deleteFile.fulfilled, (state, { payload }) => {
				const { drive, email, id } = payload;
				state.files = state.files.filter(
					file => file.drive !== drive && file.email !== email && file.id !== id
				);
				state.requests.deleteFile = requestSuccessState;
			})
			.addCase(deleteFile.rejected, state => {
				state.requests.deleteFile = requestErrorState;
			});
	},
});

export default filesSlice.reducer;
