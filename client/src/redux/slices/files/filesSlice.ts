import { createSlice } from '@reduxjs/toolkit';
import { FilesState } from './types';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';
import {
	deleteFile,
	getRootFiles,
	getFolderDriveFiles,
	renameFile,
	shareFile,
	unshareFile,
} from '../../async-actions/files.async.actions';
import { logoutUser } from '../../async-actions/user.async.actions';
import { getChanges } from '../../async-actions/drives.async.actions';
import { FileType } from '../../../shared/types/global.types';

const initialState: FilesState = {
	files: [],
	requests: {
		getFiles: requestInitialState,
		getFolderDriveFiles: requestInitialState,
		deleteFile: requestInitialState,
		renameFile: requestInitialState,
		shareFile: requestInitialState,
		unshareFile: requestInitialState,
	},
};

const filesSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// getFiles
		builder
			.addCase(getRootFiles.pending, state => {
				state.requests.getFiles = requestPendingState;
			})
			.addCase(getRootFiles.fulfilled, (state, { payload: files }) => {
				state.files = files;
				state.requests.getFiles = requestSuccessState;
			})
			.addCase(getRootFiles.rejected, state => {
				state.requests.getFiles = requestErrorState;
			});

		// getFolderFiles
		builder
			.addCase(getFolderDriveFiles.pending, state => {
				state.requests.getFolderDriveFiles = requestPendingState;
			})
			.addCase(getFolderDriveFiles.fulfilled, (state, { payload: files }) => {
				state.files = files;
				state.requests.getFolderDriveFiles = requestSuccessState;
			})
			.addCase(getFolderDriveFiles.rejected, state => {
				state.requests.getFolderDriveFiles = requestErrorState;
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
			.addCase(renameFile.fulfilled, (state, { payload }) => {
				const { name, id } = payload;
				const fileForUpdateIndex = state.files.findIndex(file => file.id === id);
				const tempFiles = [...state.files];
				tempFiles[fileForUpdateIndex].name = name;
				state.files = tempFiles;
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
				const { sharedLink, id } = payload;
				const fileForUpdateIndex = state.files.findIndex(file => file.id === id);
				const tempFiles = [...state.files];
				tempFiles[fileForUpdateIndex].sharedLink = sharedLink;
				state.files = tempFiles;
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
				const tempFiles = [...state.files];
				delete tempFiles[fileForUpdateIndex].sharedLink;
				state.files = tempFiles;
				state.requests.unshareFile = requestSuccessState;
			})
			.addCase(unshareFile.rejected, state => {
				state.requests.unshareFile = requestErrorState;
			});

		// deleteDrive
		// builder.addCase(deleteDrive.fulfilled, (state, { payload }) => {
		// 	const { type, email } = payload;
		// 	state.files = state.files.filter(file => file.email !== email && file.drive !== type);
		// });

		// logout
		builder.addCase(logoutUser.fulfilled, () => {
			return initialState;
		});

		// changes
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
