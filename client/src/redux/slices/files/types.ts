import { FileEntity } from '../../../shared/types/global.types';
import { RequestState } from '../types';

export interface FilesState {
	files: FileEntity[];
	requests: {
		getFiles: RequestState;
		getFolderDriveFiles: RequestState;
		deleteFile: RequestState;
		renameFile: RequestState;
		shareFile: RequestState;
		unshareFile: RequestState;
	};
}
