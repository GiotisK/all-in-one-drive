import { DriveEntity, DriveType } from './global.types';

export type ThemeMode = 'light' | 'dark';

export enum FileType {
	Folder = 'folder',
	File = 'file',
}

export type MultiMediaType = 'audio' | 'video' | 'image';

//TODO: remove and use from global types when everything is set
export interface FileEntity {
	type: FileType;
	id: string;
	permissions: string;
	drive: DriveType;
	name: string;
	size: number;
	fileEmail: string;
	ownerEmail: string;
	date: string;
	extension: string;
	isShared: boolean;
}

export type Entity = DriveEntity | FileEntity;

export type EmptyBody = Record<string, never>;
