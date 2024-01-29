import { useEffect } from 'react';
import { DriveType, Nullable } from '../shared/types/global.types';
import { connectDrive } from '../services/drives/drives.service';
import { getDrives } from '../redux/async-actions/drives.async.actions';
import { useAppDispatch } from '../redux/store/store';

export const useHandleAuthCodeFromUrl = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		let ignore = false;
		const url = document.location.search;
		const params = new URLSearchParams(url);
		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUrl(url);
		const canSendConnectDriveRequest = authCode && drive && !ignore;

		(async () => {
			if (canSendConnectDriveRequest) {
				try {
					const success = await connectDrive(authCode, drive);
					success && dispatch(getDrives());
				} catch {
					//TODO: show toast
				}
			}
		})();

		return () => {
			ignore = true;
		};
	}, [dispatch]);
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
