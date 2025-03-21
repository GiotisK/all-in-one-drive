import { useTheme } from 'styled-components';
import { SvgNames, createSvg } from './svg-utils';
import { DriveType, Nullable } from '../types/global.types';

export const CreateDriveSvg = (drive: DriveType, size = 35): Nullable<JSX.Element> => {
	const theme = useTheme();
	let svgName: SvgNames;

	switch (drive) {
		case DriveType.GoogleDrive:
			svgName = SvgNames.GoogleDrive;
			break;
		case DriveType.Dropbox:
			svgName = SvgNames.Dropbox;
			break;
		case DriveType.OneDrive:
			svgName = SvgNames.OneDrive;
			break;
	}

	return createSvg(svgName, size, theme?.colors.textSecondary);
};

export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0 || bytes === undefined) return '-';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getDriveTypeFromString = (driveType: string): Nullable<DriveType> => {
	switch (driveType) {
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

//todo: add the rest of the types
export const isNativeGoogleDriveFile = (fileExtension: string): boolean => {
	return fileExtension === 'gdoc' || fileExtension === 'gsheet';
};

const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
const MinimumFileSize = 20 * 1024 * 1024; // 20MB

export const canBeOpenedOnline = (fileExtension: string, size: number): boolean => {
	return (
		size <= MinimumFileSize &&
		(audioExtensions.includes(fileExtension) ||
			videoExtensions.includes(fileExtension) ||
			imageExtensions.includes(fileExtension))
	);
};
