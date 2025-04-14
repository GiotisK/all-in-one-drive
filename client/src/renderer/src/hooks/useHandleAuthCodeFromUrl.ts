import { useEffect, useRef } from 'react';
import { DriveType, Nullable } from '../shared/types/global.types';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useConnectDriveMutation } from '../redux/rtk/driveApi';

export const useHandleAuthCodeFromUrl = () => {
	const location = useLocation();
	const [params] = useSearchParams();
	const [connectDrive] = useConnectDriveMutation();
	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;

		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUrl(location.search);

		if (authCode && drive) {
			connectDrive({ authCode, drive });
			hasRun.current = true;
		}
	}, [connectDrive, location.search, params]);
};

// Helpers

const getDriveFromAuthCodeUrl = (authCodeUri: string): Nullable<DriveType> => {
	switch (true) {
		case authCodeUri.includes('google'):
			return DriveType.GoogleDrive;
		case authCodeUri.includes('dropbox'):
			return DriveType.Dropbox;
		default:
			return DriveType.OneDrive;
	}
};
