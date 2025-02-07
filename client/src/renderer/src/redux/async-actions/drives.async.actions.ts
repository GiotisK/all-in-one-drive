import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriveChanges } from '../../shared/types/global.types';
import DrivesService from '../../services/drives/drives.service';

type SubscribeForChangesParams = { driveId: string };
export const subscribeForChanges = createAsyncThunk(
	'drives/subscribeForChanges',
	async ({ driveId }: SubscribeForChangesParams) => {
		const watchChangesChannel = await DrivesService.subscribeForDriveChanges(driveId);
		return { driveId, watchChangesChannel };
	}
);

type UnSubscribeForChangesParams = {
	driveId: string;
	id: string;
	resourceId: string;
};
export const unsubscribeForChanges = createAsyncThunk(
	'drives/unsubscribeForChanges',
	async ({ id, resourceId, driveId }: UnSubscribeForChangesParams) => {
		return await DrivesService.unsubscribeForDriveChanges(driveId, id, resourceId);
	}
);

//TODO: check if driveId is needed
//REMOVE driveId from repsonse, take the one from request param
type GetChangesParams = { driveId: string; startPageToken: string };
type GetChangesResponse = { driveId: string; changes: DriveChanges };
export const getChanges = createAsyncThunk(
	'drives/changes',
	async ({ driveId, startPageToken }: GetChangesParams): Promise<GetChangesResponse> => {
		return await DrivesService.getDriveChanges(driveId, startPageToken);
	}
);
