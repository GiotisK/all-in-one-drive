import { FileEntity } from '../../../shared/types/global.types';
import { RequestState } from '../types';

export interface FilesState {
	files: FileEntity[];
	requests: {
		renameFile: RequestState;
		shareFile: RequestState;
		unshareFile: RequestState;
		createFolder: RequestState;
		downloadFile: RequestState;
		uploadFile: RequestState;
	};
}
