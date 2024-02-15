import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriveChanges, DriveType } from '../../shared/types/global.types';
import DrivesService from '../../services/drives/drives.service';

export const getDrives = createAsyncThunk('drives/getDrives', async () => {
	const drives = await DrivesService.getDrives();
	return drives;
});

type DeleteDriveParams = { email: string; type: DriveType; id: string };
export const deleteDrive = createAsyncThunk(
	'drives/deleteDrive',
	async ({ email, type, id }: DeleteDriveParams) => {
		await DrivesService.deleteDrive(email, type);
		return { email, type, id };
	}
);

type SubscribeForChangesParams = { email: string; drive: DriveType };
export const subscribeForChanges = createAsyncThunk(
	'drives/subscribeForChanges',
	async ({ email, drive }: SubscribeForChangesParams) => {
		const watchChangesChannel = await DrivesService.subscribeForDriveChanges(email, drive);
		return { email, drive, watchChangesChannel };
	}
);

type UnSubscribeForChangesParams = {
	drive: DriveType;
	email: string;
	id: string;
	resourceId: string;
};
export const unsubscribeForChanges = createAsyncThunk(
	'drives/unsubscribeForchanges',
	async ({ email, drive, id, resourceId }: UnSubscribeForChangesParams) => {
		return await DrivesService.unsubscribeForDriveChanges(email, drive, id, resourceId);
	}
);

type GetChangesParams = { email: string; startPageToken: string };
type GetChangesResponse = {
	email: string;
	driveType: DriveType;
	changes: DriveChanges;
};
export const getChanges = createAsyncThunk(
	'drives/changes',
	async ({ email, startPageToken }: GetChangesParams): Promise<GetChangesResponse> => {
		return await DrivesService.getDriveChanges(email, startPageToken);
	}
);
