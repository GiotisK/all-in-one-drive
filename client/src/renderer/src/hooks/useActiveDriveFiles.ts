import { DriveEntity, FileEntity } from '../shared/types/global.types';
import { useIsInsideFolder } from './useIsInsideFolder';
import {
	useGetDriveFolderFilesQuery,
	useGetDriveRootFilesQuery,
	useGetDrivesQuery,
} from '../redux/rtk/driveApi';
import { useParams } from 'react-router-dom';
import { useDriveSelectionContext } from './useDriveSelectionContext';

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
		isLoading: folderFilesLoading,
		currentData: folderFilesCurrentData,
		isSuccess: folderFilesSuccess,
		isUninitialized: folderFilesUninitialized,
	} = useGetDriveFolderFilesQuery(
		{ driveId, folderId },
		{ skip: !folderId || !driveId, refetchOnMountOrArgChange: true }
	);

	const { selectedDriveIds } = useDriveSelectionContext();

	const isInsideFolder = useIsInsideFolder();

	// workaround for the following case where rtk is limiting us.
	// If we enter a folder, isLoading will be false but isRefetching will be true
	// However if we use isRefetching, then we will have loader also when we rename
	// because of the cache invalidation. To show a loader only when we enter a folder
	// we need this workaround
	const shouldShowLoaderWhenEnteringFolderForTheFirstTime =
		folderFilesCurrentData === undefined && isInsideFolder ? true : false;

	return {
		files: isInsideFolder
			? folderFilesCurrentData ?? []
			: filterFiles(rootFiles, drives, selectedDriveIds),
		isLoading:
			rootFilesLoading ||
			folderFilesLoading ||
			shouldShowLoaderWhenEnteringFolderForTheFirstTime,
		isSuccess: rootFilesSuccess || folderFilesSuccess,
		isUninitialized: rootFilesUninitialized && folderFilesUninitialized,
	};
};

const filterFiles = (files: FileEntity[], drives: DriveEntity[], selectedDriveIds: string[]) => {
	return files.filter(file =>
		drives.some(
			drive =>
				drive.email === file.email &&
				drive.type === file.drive &&
				selectedDriveIds.includes(drive.id)
		)
	);
};
