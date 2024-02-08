import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getFiles, getFolderDriveFiles } from '../redux/async-actions/files.async.actions';
import { useAppDispatch } from '../redux/store/store';
import { DriveType, Nullable } from '../shared/types/global.types';

export const useFetchFolderContents = () => {
	const dispatch = useAppDispatch();
	const pathParams = useParams();

	useEffect(() => {
		const { folderId, email, drive: driveTypeAsString } = pathParams;
		const hasPathParams = folderId && email && driveTypeAsString;
		const driveType = getDriveTypeFromString(driveTypeAsString ?? '');

		if (hasPathParams && driveType) {
			dispatch(getFolderDriveFiles({ drive: driveType, email, id: folderId }));
		} else {
			dispatch(getFiles());
		}
	}, [dispatch, pathParams]);
};

// Helpers
const getDriveTypeFromString = (driveTypeAsString: string): Nullable<DriveType> => {
	switch (driveTypeAsString) {
		case DriveType.Dropbox:
			return DriveType.Dropbox;
		case DriveType.GoogleDrive:
			return DriveType.GoogleDrive;
		case DriveType.OneDrive:
			return DriveType.OneDrive;
		default:
			return null;
	}
};
