import { DriveEntity } from '../../../shared/types/global.types';

export interface DrivesState {
	googledrive: DriveEntity[];
	dropbox: DriveEntity[];
	onedrive: DriveEntity[];
}
