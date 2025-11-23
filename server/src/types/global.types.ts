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
	driveIds: string[];
}

export interface UnsubscribeForChangesRequestBody {
	driveId: string;
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

export interface CreateFileRequestBody {
	type: FileType;
	parentFolderId?: string;
}

export enum Status {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	INTERNAL_SERVER_ERROR = 500,
}

export enum DriveType {
	GoogleDrive = 'googledrive',
	Dropbox = 'dropbox',
	OneDrive = 'onedrive',
	VirtualDrive = 'virtualdrive',
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
	watchChangesChannel?: WatchChangesChannel;
};

export type FileEntity = {
	id: string;
	name: string;
	type: FileType;
	email: string;
	drive: DriveType;
	driveId: string;
	size: string;
	date: string;
	extension: string;
	sharedLink: Nullable<string>;
	sizeBytes: number;
	thumbnail: Nullable<string>;
};

export type ChangedFileEntity = {
	id: string;
	removed: boolean;
	name: string;
	date: string;
	type: FileType;
	sharedLink: Nullable<string>;
	driveId: string;
};

export type DriveChanges = {
	changes: ChangedFileEntity[];
	startPageToken: string;
};

export type WatchChangesChannel = {
	id: string;
	resourceId: string;
	startPageToken: string;
	driveId: string;
};

export enum FileType {
	Folder = 'folder',
	File = 'file',
}

export type ServerSideEventChangeData = {
	driveType: string;
	driveId: string;
	change: 'sync' | 'change';
};

export type ServerSideEventProgressData = {
	operationUuid: string;
	name: string;
	fileId: string;
	driveId: string;
	type: FileOperationType;
	percentage: number;
};

export type FileOperationType = 'download' | 'upload';
