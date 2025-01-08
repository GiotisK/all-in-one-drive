import { useEffect, useRef } from 'react';
import { DriveType, Nullable } from '../shared/types/global.types';
import DrivesService from '../services/drives/drives.service';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLazyGetDrivesQuery } from '../redux/rtk/driveApi';

export const useHandleAuthCodeFromUrl = () => {
	const location = useLocation();
	const [params] = useSearchParams();
	const isRequestSent = useRef<boolean>(false);
	const [trigger] = useLazyGetDrivesQuery();

	useEffect(() => {
		let ignore = false;
		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUrl(location.search);
		const canSendConnectDriveRequest = authCode && drive && !ignore;

		(async () => {
			if (canSendConnectDriveRequest && !isRequestSent.current) {
				try {
					isRequestSent.current = true;
					const success = await DrivesService.connectDrive(authCode, drive);
					if (success) {
						trigger();
					}
				} catch {
					toast.error('Failed to connect drive');
				}
			}
		})();

		return () => {
			ignore = true;
		};
	}, [location.search, params, trigger]);
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
