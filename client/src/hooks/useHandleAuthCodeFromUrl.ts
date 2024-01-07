import { useEffect, useRef } from 'react';
import { DriveType } from '../shared/types/global.types';
import { connectDrive } from '../services/drive/drive.service';
import { Nullable } from '../shared/types/utils.types';

export const useHandleAuthCodeFromUrl = () => {
	const isRequestSent = useRef<boolean>(false);

	useEffect(() => {
		const url = document.location.search;
		const params = new URLSearchParams(url);
		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUri(url);

		if (authCode && drive && !isRequestSent.current) {
			connectDrive(authCode, drive);
			isRequestSent.current = true;
		}
	}, []);
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
