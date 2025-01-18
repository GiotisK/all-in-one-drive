import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DrivesState } from './types';
import { subscribeForChanges, getChanges } from '../../async-actions/drives.async.actions';

const initialState: DrivesState = {
	drives: [],
};

const drivesSlice = createSlice({
	name: 'drives',
	initialState,
	reducers: {
		toggleDriveSelection(state, action: PayloadAction<string>) {
			const index = state.drives.findIndex(drive => drive.id === action.payload);

			if (index >= 0) {
				state.drives[index].active = !state.drives[index].active;
			}
		},
		toggleAllDrivesSelection(state, action: PayloadAction<boolean>) {
			state.drives.forEach(drive => (drive.active = action.payload));
		},
	},
	extraReducers: builder => {
		// subscribeForChanges
		builder.addCase(subscribeForChanges.fulfilled, (state, { payload }) => {
			const { driveId, watchChangesChannel } = payload;

			const driveEntity = state.drives.find(drive => drive.id === driveId);

			if (!driveEntity) {
				console.log(`Could not find drive with id: ${driveId}`);
				return;
			}

			driveEntity.watchChangesChannel = watchChangesChannel;
		});

		// getChanges
		builder.addCase(getChanges.fulfilled, (state, { payload }) => {
			const {
				changes: { startPageToken },
				driveId,
			} = payload;

			// TODO: Probably return the driveId as-well as with the file id?
			const driveToUpdate = state.drives.find(drive => drive.id === driveId);

			if (!driveToUpdate) {
				console.log(`Could not find drive with id : ${driveId}`);
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
