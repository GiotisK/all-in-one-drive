export type Nullable<T> = T | null;

export interface RegisterUserRequestBody {
	email: string;
	password: string;
}

export interface LoginUserRequestBody {
	email: string;
	password: string;
}

export interface ConnectDriveRequestBody {
	authCode: string;
}

export interface AuthUserResponse {
	email: string;
}

export interface SubscribeForChangesRequestBody {
	drive: DriveType;
	email: string;
}

export interface UnsubscribeForChangesRequestBody {
	drive: DriveType;
	email: string;
	id: string;
	resourceId: string;
}

export interface PatchFileRequestBody {
	name?: string;
	share?: boolean;
}

export interface PatchFileResponse {
	operation: {
		rename?: {
			success: boolean;
			name: string;
		};
		share?: {
			success: boolean;
			sharedLink: string;
		};
		unshare?: {
			success: boolean;
		};
	};
}

export enum Status {
	OK = 200,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	INTERNAL_SERVER_ERROR = 500,
}

export enum DriveType {
	GoogleDrive = 'googledrive',
	Dropbox = 'dropbox',
	OneDrive = 'onedrive',
}

export type DriveQuota = {
	used: string;
	total: string;
};

export type DriveEntity = {
	id: string;
	type: DriveType;
	email: string;
	quota: DriveQuota;
	active: boolean;
	watchChangesChannel?: WatchChangesChannel; // TODO: Fix name
};

export type FileEntity = {
	id: string;
	name: string;
	type: FileType;
	email: string;
	drive: DriveType;
	size: string;
	date: string;
	extension: string;
	sharedLink?: Nullable<string>;
};

export type ChangedFileEntity = {
	id: string;
	removed: boolean;
	name: string;
	date: string;
	type: FileType;
	sharedLink: Nullable<string>;
};

export type DriveChanges = {
	changes: ChangedFileEntity[];
	startPageToken: string;
};

export type WatchChangesChannel = {
	id: string;
	resourceId: string;
	startPageToken: string;
};

export enum FileType {
	Folder = 'folder',
	File = 'file',
}
