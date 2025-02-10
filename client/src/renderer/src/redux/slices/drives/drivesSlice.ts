import { createSlice } from '@reduxjs/toolkit';
/* import { subscribeForChanges, getChanges } from '../../async-actions/drives.async.actions'; */

const initialState = {};

const drivesSlice = createSlice({
	name: 'drives',
	initialState,
	reducers: {},
	// extraReducers: builder => {
	// 	// subscribeForChanges
	// 	builder.addCase(subscribeForChanges.fulfilled, (state, { payload }) => {
	// 		const { driveId, watchChangesChannel } = payload;

	// 		const driveEntity = state.drives.find(drive => drive.id === driveId);

	// 		if (!driveEntity) {
	// 			console.log(`Could not find drive with id: ${driveId}`);
	// 			return;
	// 		}

	// 		driveEntity.watchChangesChannel = watchChangesChannel;
	// 	});

	// 	// getChanges
	// 	builder.addCase(getChanges.fulfilled, (state, { payload }) => {
	// 		const {
	// 			changes: { startPageToken },
	// 			driveId,
	// 		} = payload;

	// 		// TODO: Probably return the driveId as-well as with the file id?
	// 		const driveToUpdate = state.drives.find(drive => drive.id === driveId);

	// 		if (!driveToUpdate) {
	// 			console.log(`Could not find drive with id : ${driveId}`);
	// 			return;
	// 		}

	// 		if (driveToUpdate.watchChangesChannel) {
	// 			driveToUpdate.watchChangesChannel.startPageToken = startPageToken;
	// 		}
	// 	});
	// },
});

export default drivesSlice.reducer;
