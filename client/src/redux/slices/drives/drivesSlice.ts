import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DrivesState } from './types';
import { DriveEntity } from '../../../shared/types/global.types';

const initialState: DrivesState = {
	drives: [],
};

const drivesSlice = createSlice({
	name: 'drives',
	initialState,
	reducers: {
		setDrives: (state: DrivesState, { payload: drives }: PayloadAction<DriveEntity[]>) => {
			state.drives = drives;
		},
		deleteDrive: (
			state: DrivesState,
			{ payload: driveForDelete }: PayloadAction<DriveEntity>
		) => {
			state.drives = state.drives.filter(drive => drive.email !== driveForDelete.email);
		},
	},
});

export const { setDrives, deleteDrive } = drivesSlice.actions;

export default drivesSlice.reducer;
