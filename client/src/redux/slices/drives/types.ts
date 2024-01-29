import { DriveEntity } from '../../../shared/types/global.types';
import { RequestState } from '../types';

export interface DrivesState {
	drives: DriveEntity[];
	requests: {
		deleteDrive: RequestState;
		getDrives: RequestState;
	};
}
