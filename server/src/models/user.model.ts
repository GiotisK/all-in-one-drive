import mongoose from 'mongoose';
import { DriveType } from '../types/global.types';

//todo: create DTO
export type DriveSchema = {
	id: string;
	email: string;
	virtualFolderId?: string;
	token: string;
	driveType: DriveType;
};

//todo: create DTO
export interface UserSchema {
	id: number;
	email: string;
	password: string;
	drives: DriveSchema[];
}

//todo: move this shit to mongodb service
const userSchema = new mongoose.Schema<UserSchema>({
	email: { type: String, required: true, unique: true },
	password: { type: String },
	drives: [
		{
			email: String,
			virtualFolderId: { type: String, default: '' },
			token: String,
			driveType: String,
		},
	],
});

export default mongoose.model<UserSchema>('User', userSchema);
