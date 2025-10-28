import { useEffect, useRef } from 'react';
import { DriveType, Nullable } from '../shared/types/global.types';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useConnectDriveMutation, useLazyGetDrivesQuery } from '../redux/rtk/driveApi';

export const useHandleAuthCodeFromUrl = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [connectDrive] = useConnectDriveMutation({
		fixedCacheKey: 'connectDrive',
	});
	const getDrivesQuery = useLazyGetDrivesQuery()[0];

	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;

		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUrl(location.search);

		if (authCode && drive) {
			connectDrive({ authCode, drive });
			hasRun.current = true;
			setTimeout(() => {
				getDrivesQuery();
			}, 3000);
		}
	}, [connectDrive, getDrivesQuery, location.search, navigate, params]);
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
