import { useEffect } from 'react';
import { DriveType } from '../shared/types/global.types';
import { connectDrive } from '../services/drives/drives.service';
import { Nullable } from '../shared/types/utils.types';

export const useHandleAuthCodeFromUrl = () => {
	useEffect(() => {
		const url = document.location.search;
		const params = new URLSearchParams(url);
		const authCode = params.get('code');
		const drive = getDriveFromAuthCodeUri(url);

		if (authCode && drive) {
			connectDrive(authCode, drive);
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
