export type ThemeMode = 'light' | 'dark';
export enum DriveType {
	GoogleDrive = 'googledrive',
	Dropbox = 'dropbox',
	OneDrive = 'onedrive',
}
export enum FileType {
	Folder = 'folder',
	File = 'file',
}

export interface FileEntity {
	id: string;
	permissions: string;
	type: FileType;
	drive: DriveType;
	name: string;
	size: number;
	fileEmail: string;
	ownerEmail: string;
	date: string;
	extension: string;
	isShared: boolean;
}

export interface DriveEntity {
	type: DriveType;
	email: string;
}

export type Entity = DriveEntity | FileEntity;

export type EmptyBody = Record<string, never>;
