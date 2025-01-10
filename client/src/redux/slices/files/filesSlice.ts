import { createSlice } from '@reduxjs/toolkit';
import { FilesState } from './types';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';
import {
	renameFile,
	shareFile,
	unshareFile,
	createFolder,
	downloadFile,
	uploadFile,
} from '../../async-actions/files.async.actions';
import { logoutUser } from '../../async-actions/user.async.actions';
import { getChanges } from '../../async-actions/drives.async.actions';
import { FileType } from '../../../shared/types/global.types';

const initialState: FilesState = {
	files: [],
	requests: {
		renameFile: { ...requestInitialState },
		shareFile: { ...requestInitialState },
		unshareFile: { ...requestInitialState },
		createFolder: { ...requestInitialState },
		downloadFile: { ...requestInitialState },
		uploadFile: { ...requestInitialState },
	},
};

const filesSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// renameFile
		builder
			.addCase(renameFile.pending, state => {
				state.requests.renameFile = requestPendingState;
			})
			.addCase(renameFile.fulfilled, (state, { payload }) => {
				const { name, fileId } = payload;
				const fileForUpdateIndex = state.files.findIndex(file => file.id === fileId);

				state.files[fileForUpdateIndex].name = name;
				state.requests.renameFile = requestSuccessState;
			})
			.addCase(renameFile.rejected, state => {
				state.requests.renameFile = requestErrorState;
			});

		// shareFile
		builder
			.addCase(shareFile.pending, state => {
				state.requests.shareFile = requestPendingState;
			})
			.addCase(shareFile.fulfilled, (state, { payload }) => {
				const { sharedLink, fileId } = payload;
				const fileForUpdateIndex = state.files.findIndex(file => file.id === fileId);

				state.files[fileForUpdateIndex].sharedLink = sharedLink;
				state.requests.shareFile = requestSuccessState;
			})
			.addCase(shareFile.rejected, state => {
				state.requests.shareFile = requestErrorState;
			});

		// unshareFile
		builder
			.addCase(unshareFile.pending, state => {
				state.requests.unshareFile = requestPendingState;
			})
			.addCase(unshareFile.fulfilled, (state, { payload: id }) => {
				const fileForUpdateIndex = state.files.findIndex(file => file.id === id);

				state.files[fileForUpdateIndex].sharedLink = null;
				state.requests.unshareFile = requestSuccessState;
			})
			.addCase(unshareFile.rejected, state => {
				state.requests.unshareFile = requestErrorState;
			});

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

		// uploadFile
		builder
			.addCase(uploadFile.pending, state => {
				state.requests.uploadFile = requestPendingState;
			})
			.addCase(uploadFile.fulfilled, (state, { payload: file }) => {
				state.files.unshift(file);
				state.requests.uploadFile = requestSuccessState;
			})
			.addCase(uploadFile.rejected, state => {
				state.requests.uploadFile = requestErrorState;
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
