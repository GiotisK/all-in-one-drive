import { DriveType } from './global.types';

export type ThemeMode = 'light' | 'dark';

export enum FileType {
	Folder = 'folder',
	File = 'file',
}

export type MultimediaType = 'audio' | 'video' | 'image';

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
