import { useIsInsideFolder } from './useIsInsideFolder';
import { useGetDriveFolderFilesQuery } from '../redux/rtk/driveApi';
import { useParams } from 'react-router-dom';

export const useActiveDriveFiles = () => {
	const { folderId, driveId } = useParams();

	const {
		isLoading: folderFilesLoading,
		currentData: folderFilesCurrentData,
		isSuccess: folderFilesSuccess,
		isUninitialized: folderFilesUninitialized,
	} = useGetDriveFolderFilesQuery({ driveId, folderId });

	const isInsideFolder = useIsInsideFolder();

	// workaround for the following case where rtk is limiting us.
	// If we enter a folder, isLoading will be false but isRefetching will be true
	// However if we use isRefetching, then we will have loader also when we rename
	// because of the cache invalidation. To show a loader only when we enter a folder
	// we need this workaround
	const shouldShowLoaderWhenEnteringFolderForTheFirstTime =
		folderFilesCurrentData === undefined && isInsideFolder ? true : false;

	return {
		files: folderFilesCurrentData ?? [],
		isLoading: folderFilesLoading || shouldShowLoaderWhenEnteringFolderForTheFirstTime,
		isSuccess: folderFilesSuccess,
		isUninitialized: folderFilesUninitialized,
	};
};
