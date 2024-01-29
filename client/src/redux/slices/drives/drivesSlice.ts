import { createSlice } from '@reduxjs/toolkit';
import { DrivesState } from './types';
import { getDrives, deleteDrive } from '../../async-actions/drives.async.actions';
import {
	requestErrorState,
	requestInitialState,
	requestPendingState,
	requestSuccessState,
} from '../constants';

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
	reducers: {},
	extraReducers: builder => {
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
		builder
			.addCase(deleteDrive.pending, state => {
				state.requests.deleteDrive = requestPendingState;
			})
			.addCase(deleteDrive.fulfilled, (state, { payload }) => {
				const { type, email } = payload;
				state.drives = state.drives.filter(
					drive => drive.type !== type && drive.email !== email
				);
				state.requests.deleteDrive = requestSuccessState;
			})
			.addCase(deleteDrive.rejected, state => {
				state.requests.deleteDrive = requestErrorState;
			});
	},
});

export default drivesSlice.reducer;
