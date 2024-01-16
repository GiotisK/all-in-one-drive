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
		setDrives: (state: DrivesState, { payload }: PayloadAction<DriveEntity[]>) => {
			state.drives = payload;
		},
	},
});

export const { setDrives } = drivesSlice.actions;

export default drivesSlice.reducer;
