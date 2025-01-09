import { DriveEntity, FileEntity } from '../shared/types/global.types';
import { useIsInsideFolder } from './useIsInsideFolder';
import {
	useGetDriveFolderFilesQuery,
	useGetDriveRootFilesQuery,
	useGetDrivesQuery,
} from '../redux/rtk/driveApi';
import { useParams } from 'react-router-dom';

export const useActiveDriveFiles = () => {
	const { folderId, driveId } = useParams();
	const { data: drives = [] } = useGetDrivesQuery();
	const {
		data: rootFiles = [],
		isLoading: rootFilesLoading,
		isSuccess: rootFilesSuccess,
		isUninitialized: rootFilesUninitialized,
	} = useGetDriveRootFilesQuery(undefined, { skip: !!folderId || !drives.length });

	const {
		data: folderFiles = [],
		isLoading: folderFilesLoading,
		isSuccess: folderFilesSuccess,
		isFetching: folderFilesFetching,
		isUninitialized: folderFilesUninitialized,
	} = useGetDriveFolderFilesQuery({ driveId, folderId }, { skip: !folderId || !driveId });

	const isInsideFolder = useIsInsideFolder();

	return {
		files: isInsideFolder ? folderFiles : filterFiles(rootFiles, drives),
		isLoading: rootFilesLoading || folderFilesLoading || folderFilesFetching,
		isSuccess: rootFilesSuccess || folderFilesSuccess,
		isUninitialized: rootFilesUninitialized && folderFilesUninitialized,
	};
};

const filterFiles = (files: FileEntity[], drives: DriveEntity[]) => {
	return files.filter(file =>
		drives.some(
			drive => drive.email === file.email && drive.type === file.drive && drive.active
		)
	);
};
