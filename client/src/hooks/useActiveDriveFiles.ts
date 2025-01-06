import { useAppSelector } from '../redux/store/store';
import { DriveEntity, FileEntity } from '../shared/types/global.types';
import { useIsInsideFolder } from './useIsInsideFolder';
import { useGetDriveFolderFilesQuery, useGetDriveRootFilesQuery } from '../redux/rtk/driveApi';
import { useParams } from 'react-router-dom';

export const useActiveDriveFiles = () => {
	const drives = useAppSelector(state => state.drives.drives);
	const { folderId, driveId } = useParams();
	const {
		data: rootFiles = [],
		isLoading: rootFilesLoading,
		isSuccess: rootFilesSuccess,
		isFetching: rootFilesFetching,
	} = useGetDriveRootFilesQuery(undefined, { skip: !drives.length });
	const {
		data: folderFiles = [],
		isLoading: folderFilesLoading,
		isSuccess: folderFilesSuccess,
		isFetching: folderFilesFetching,
	} = useGetDriveFolderFilesQuery({ driveId, folderId }, { skip: !folderId || !driveId });

	const isInsideFolder = useIsInsideFolder();

	return {
		files: isInsideFolder ? folderFiles : filterFiles(rootFiles, drives),
		isLoading:
			rootFilesLoading || folderFilesLoading || rootFilesFetching || folderFilesFetching,
		isSuccess: rootFilesSuccess || folderFilesSuccess,
	};
};

const filterFiles = (files: FileEntity[], drives: DriveEntity[]) => {
	return files.filter(file =>
		drives.some(
			drive => drive.email === file.email && drive.type === file.drive && drive.active
		)
	);
};
