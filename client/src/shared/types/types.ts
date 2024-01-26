import { DriveEntity, FileEntity } from './global.types';

export type ThemeMode = 'light' | 'dark';

export enum FileType {
	Folder = 'folder',
	File = 'file',
}

export type MultiMediaType = 'audio' | 'video' | 'image';

export type Entity = DriveEntity | FileEntity;
