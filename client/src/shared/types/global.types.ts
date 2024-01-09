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

export interface DriveEntity {
	type: DriveType;
	email: string;
	quota: DriveQuota;
}
