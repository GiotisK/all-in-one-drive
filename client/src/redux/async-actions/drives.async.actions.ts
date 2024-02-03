import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteDriveEntity, getDriveEntities } from '../../services/drives/drives.service';
import { DriveType } from '../../shared/types/global.types';

export const getDrives = createAsyncThunk('drives/getDrives', async () => {
	const drives = await getDriveEntities();
	return drives;
});

type DeleteDriveParams = { email: string; type: DriveType };
export const deleteDrive = createAsyncThunk(
	'drives/deleteDrive',
	async ({ email, type }: DeleteDriveParams) => {
		await deleteDriveEntity(email, type);
		return { email, type };
	}
);
