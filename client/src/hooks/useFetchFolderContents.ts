import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { getRootFiles, getFolderDriveFiles } from '../redux/async-actions/files.async.actions';
import { useAppDispatch } from '../redux/store/store';
import { DriveType, Nullable } from '../shared/types/global.types';

export const useFetchFolderContents = () => {
	const dispatch = useAppDispatch();
	const pathParams = useParams();
	const folderDepth = useRef<number>(0);

	useEffect(() => {
		const { folderId, email, drive: driveTypeAsString } = pathParams;
		const hasPathParams = folderId && email && driveTypeAsString;
		const driveType = getDriveTypeFromString(driveTypeAsString ?? '');

		if (hasPathParams && driveType) {
			folderDepth.current++;
			dispatch(getFolderDriveFiles({ drive: driveType, email, id: folderId }));
		} else if (folderDepth.current > 0) {
			folderDepth.current = 0;
			dispatch(getRootFiles());
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
