import { FileEntity, Nullable } from '../../shared/types/global.types';
import { getRequest } from '../request.service';

export const getRootFiles = async (): Promise<Nullable<FileEntity[]>> => {
	try {
		const { data: fileEntities } = await getRequest<FileEntity[]>('/files');

		return fileEntities;
	} catch {
		return null;
	}
};
