import { DriveDTO, UserDTO } from '../types';

export type SQLiteDriveSchema = DriveDTO & { userId: number };
export type SQLiteUserSchema = Omit<UserDTO, 'drives'>;
