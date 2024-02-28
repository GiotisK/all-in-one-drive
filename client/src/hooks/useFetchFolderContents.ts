import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { getRootFiles, getFolderDriveFiles } from '../redux/async-actions/files.async.actions';
import { useAppDispatch } from '../redux/store/store';

export const useFetchFolderContents = () => {
	const dispatch = useAppDispatch();
	const pathParams = useParams();
	const folderDepth = useRef<number>(0);

	useEffect(() => {
		const { folderId, driveId } = pathParams;
		const hasPathParams = folderId && driveId;

		if (hasPathParams) {
			folderDepth.current++;
			dispatch(getFolderDriveFiles({ driveId, folderId }));
		} else if (folderDepth.current > 0) {
			folderDepth.current = 0;
			dispatch(getRootFiles());
		}
	}, [dispatch, pathParams]);
};
