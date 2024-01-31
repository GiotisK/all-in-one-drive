import { createSlice } from '@reduxjs/toolkit';
import { FilesState } from './types';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';
import { deleteFile, getFiles, renameFile } from '../../async-actions/files.async.actions';
import { logoutUser } from '../../async-actions/user.async.actions';

const initialState: FilesState = {
	files: [],
	requests: {
		getFiles: requestInitialState,
		deleteFile: requestInitialState,
		renameFile: requestInitialState,
	},
};

const filesSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// getFiles
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

		// deleteFile
		builder
			.addCase(deleteFile.pending, state => {
				state.requests.deleteFile = requestPendingState;
			})
			.addCase(deleteFile.fulfilled, (state, { payload: fileId }) => {
				state.files = state.files.filter(file => file.id !== fileId);
				state.requests.deleteFile = requestSuccessState;
			})
			.addCase(deleteFile.rejected, state => {
				state.requests.deleteFile = requestErrorState;
			});

		// renameFile
		builder
			.addCase(renameFile.pending, state => {
				state.requests.renameFile = requestPendingState;
			})
			.addCase(renameFile.fulfilled, (state, { payload: fileId }) => {
				state.files = state.files.filter(file => file.id !== fileId);
				state.requests.renameFile = requestSuccessState;
			})
			.addCase(renameFile.rejected, state => {
				state.requests.renameFile = requestErrorState;
			});

		// logout
		builder.addCase(logoutUser.fulfilled, () => {
			return initialState;
		});
	},
});

export default filesSlice.reducer;
