import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DrivesState } from './types';
import { getDrives, deleteDrive } from '../../async-actions/drives.async.actions';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';
import { logoutUser } from '../../async-actions/user.async.actions';

const initialState: DrivesState = {
	drives: [],
	requests: {
		deleteDrive: requestInitialState,
		getDrives: requestInitialState,
	},
};

const drivesSlice = createSlice({
	name: 'drives',
	initialState,
	reducers: {
		toggleDriveSelection(state, action: PayloadAction<string>) {
			const tempDrives = [...state.drives];
			const index = tempDrives.findIndex(drive => drive.id === action.payload);

			if (index >= 0) {
				tempDrives[index].active = !tempDrives[index].active;
				state.drives = tempDrives;
			}
		},
		toggleAllDrivesSelection(state, action: PayloadAction<boolean>) {
			const tempDrives = [...state.drives];
			tempDrives.forEach(drive => (drive.active = action.payload));
			state.drives = tempDrives;
		},
	},
	extraReducers: builder => {
		// getDrives
		builder
			.addCase(getDrives.pending, state => {
				state.requests.getDrives = requestPendingState;
			})
			.addCase(getDrives.fulfilled, (state, { payload: drives }) => {
				state.drives = drives;
				state.requests.getDrives = requestSuccessState;
			})
			.addCase(getDrives.rejected, state => {
				state.requests.getDrives = requestErrorState;
			});

		// deleteDrive
		builder
			.addCase(deleteDrive.pending, state => {
				state.requests.deleteDrive = requestPendingState;
			})
			.addCase(deleteDrive.fulfilled, (state, { payload: id }) => {
				state.drives = state.drives.filter(drive => drive.id !== id);
				state.requests.deleteDrive = requestSuccessState;
			})
			.addCase(deleteDrive.rejected, state => {
				state.requests.deleteDrive = requestErrorState;
			});

		// logout
		builder.addCase(logoutUser.fulfilled, () => {
			return initialState;
		});
	},
});

export default drivesSlice.reducer;
export const { toggleDriveSelection, toggleAllDrivesSelection } = drivesSlice.actions;
