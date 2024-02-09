import { useEffect, useRef } from 'react';
import { DriveType, Nullable } from '../shared/types/global.types';
import { connectDrive } from '../services/drives/drives.service';
import { getDrives } from '../redux/async-actions/drives.async.actions';
import { useAppDispatch } from '../redux/store/store';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getFiles } from '../redux/async-actions/files.async.actions';

export const useHandleAuthCodeFromUrl = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const [params] = useSearchParams();
	const isRequestSent = useRef<boolean>(false);

	useEffect(() => {
		let ignore = false;
		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUrl(location.search);
		const canSendConnectDriveRequest = authCode && drive && !ignore;

		//TODO: fix double connect request
		(async () => {
			if (canSendConnectDriveRequest && !isRequestSent.current) {
				try {
					isRequestSent.current = true;
					const success = await connectDrive(authCode, drive);
					if (success) {
						dispatch(getDrives());
						dispatch(getFiles());
					}
				} catch {
					//TODO: show toast
				}
			}
		})();

		return () => {
			ignore = true;
		};
	}, [dispatch, location.search, params]);
};

// Helpers

const getDriveFromAuthCodeUrl = (authCodeUri: string): Nullable<DriveType> => {
	switch (true) {
		case authCodeUri.includes('google'):
			return DriveType.GoogleDrive;
		case authCodeUri.includes('dropbox'):
			return DriveType.Dropbox;
		case authCodeUri.includes('onedrive'):
			return DriveType.OneDrive;
		default:
			return null;
	}
};
