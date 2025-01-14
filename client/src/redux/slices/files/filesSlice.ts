import { createSlice } from '@reduxjs/toolkit';
import { FilesState } from './types';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';
import { createFolder, downloadFile } from '../../async-actions/files.async.actions';
import { logoutUser } from '../../async-actions/user.async.actions';
import { getChanges } from '../../async-actions/drives.async.actions';
import { FileType } from '../../../shared/types/global.types';

const initialState: FilesState = {
	files: [],
	requests: {
		createFolder: { ...requestInitialState },
		downloadFile: { ...requestInitialState },
	},
};

const filesSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// downloadFile
		builder
			.addCase(downloadFile.pending, state => {
				state.requests.downloadFile = requestPendingState;
			})
			.addCase(downloadFile.fulfilled, state => {
				state.requests.downloadFile = requestSuccessState;
			})
			.addCase(downloadFile.rejected, state => {
				state.requests.downloadFile = requestErrorState;
			});

		// createFolder
		builder
			.addCase(createFolder.pending, state => {
				state.requests.createFolder = requestPendingState;
			})
			.addCase(createFolder.fulfilled, (state, { payload: folder }) => {
				state.files.unshift(folder);
				state.requests.createFolder = requestSuccessState;
			})
			.addCase(createFolder.rejected, state => {
				state.requests.createFolder = requestErrorState;
			});

		// logoutUser
		builder.addCase(logoutUser.fulfilled, () => {
			return initialState;
		});

		// getChanges
		builder.addCase(getChanges.fulfilled, (state, { payload }) => {
			const { changes } = payload;
			changes.changes.forEach(change => {
				if (change.type === FileType.File) {
					const fileToUpdateIndex = state.files.findIndex(file => file.id === change.id);
					if (fileToUpdateIndex !== -1) {
						if (change.removed) {
							state.files.splice(fileToUpdateIndex, 1);
						} else {
							state.files[fileToUpdateIndex].date = change.date;
							state.files[fileToUpdateIndex].name = change.name;
							state.files[fileToUpdateIndex].sharedLink = change.sharedLink;
						}
					} else {
						console.error(`File with ID ${change.id} not found in state.`);
					}
				}
			});
		});
	},
});

export default filesSlice.reducer;
