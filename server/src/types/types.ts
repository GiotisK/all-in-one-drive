export type AuthLocals = { email: string };

export type DatabaseServiceType = 'sqlite' | 'mongodb';

export type DriveQuotaBytes = {
	used: number;
	total: number;
};

export type ThumbnailsMap = Record<string, string>;
