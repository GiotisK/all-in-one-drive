import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DrivesState } from './types';
import {
	getDrives,
	deleteDrive,
	subscribeForChanges,
	getChanges,
} from '../../async-actions/drives.async.actions';
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
			.addCase(deleteDrive.fulfilled, (state, { payload }) => {
				const { id } = payload;
				state.drives = state.drives.filter(drive => drive.id !== id);
				state.requests.deleteDrive = requestSuccessState;
			})
			.addCase(deleteDrive.rejected, state => {
				state.requests.deleteDrive = requestErrorState;
			});

		// logoutUser
		builder.addCase(logoutUser.fulfilled, () => {
			return initialState;
		});

		// subscribeForChanges
		builder.addCase(subscribeForChanges.fulfilled, (state, { payload }) => {
			const { email, drive: driveType, watchChangesChannel } = payload;

			const driveEntity = state.drives.find(
				drive => drive.email === email && drive.type === driveType
			);

			if (!driveEntity) {
				console.log(`Could not find drive with email: ${email} and type ${driveType}`);
				return;
			}

			driveEntity.watchChangesChannel = watchChangesChannel;
		});

		// getChanges
		builder.addCase(getChanges.fulfilled, (state, { payload }) => {
			const {
				changes: { startPageToken },
				email,
				driveType,
			} = payload;

			// TODO: Probably return the driveId as-well as with the file id?
			const driveToUpdate = state.drives.find(
				drive => drive.type === driveType && drive.email === email
			);

			if (!driveToUpdate) {
				console.log(`Could not find drive with email: ${email} and type ${driveType}`);
				return;
			}

			if (driveToUpdate.watchChangesChannel) {
				driveToUpdate.watchChangesChannel.startPageToken = startPageToken;
			}
		});
	},
});

export const { toggleDriveSelection, toggleAllDrivesSelection } = drivesSlice.actions;

export default drivesSlice.reducer;
