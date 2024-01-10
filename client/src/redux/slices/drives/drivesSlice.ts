import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DrivesState } from './types';
import { DriveEntity, DriveType } from '../../../shared/types/global.types';

const initialState: DrivesState = {
	googledrive: [],
	dropbox: [],
	onedrive: [],
};

const drivesSlice = createSlice({
	name: 'drives',
	initialState,
	reducers: {
		setDrives: (state: DrivesState, { payload }: PayloadAction<DriveEntity[]>) => {
			payload.forEach(driveEntity => {
				switch (driveEntity.type) {
					case DriveType.GoogleDrive:
						state.googledrive.push(driveEntity);
						break;
					case DriveType.Dropbox:
						state.dropbox.push(driveEntity);
						break;
					case DriveType.OneDrive:
						state.onedrive.push(driveEntity);
						break;
				}
			});
		},
	},
});

export const { setDrives } = drivesSlice.actions;

export default drivesSlice.reducer;
