import { DriveType } from '../../types/global.types';

export type DriveDTO = {
	id: string;
	email: string;
	virtualFolderId?: string;
	token: string;
	driveType: DriveType;
};

export interface UserDTO {
	id: number;
	email: string;
	password: string;
}
