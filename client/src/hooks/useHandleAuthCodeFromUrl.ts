import { useEffect } from 'react';
import { DriveType, Nullable } from '../shared/types/global.types';
import { connectDrive, getDriveEntities } from '../services/drives/drives.service';
import { setDrives } from '../redux/slices/drives/drivesSlice';
import { useDispatch } from 'react-redux';

export const useHandleAuthCodeFromUrl = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		let ignore = false;
		const url = document.location.search;
		const params = new URLSearchParams(url);
		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUri(url);

		(async () => {
			if (authCode && drive && !ignore) {
				const success = await connectDrive(authCode, drive);

				if (success) {
					const driveEntities = await getDriveEntities();

					if (driveEntities) {
						dispatch(setDrives(driveEntities));
					}
				}
			}
		})();

		return () => {
			ignore = true;
		};
	}, [dispatch]);
};

// Helpers

const getDriveFromAuthCodeUri = (authCodeUri: string): Nullable<DriveType> => {
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
