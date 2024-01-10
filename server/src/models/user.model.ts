import mongoose from 'mongoose';
import { DriveType } from '../types/global.types';

export type DriveSchema = {
	email: string;
	virtualFolderId?: string;
	token: string;
	driveType: DriveType;
};

export interface UserSchema {
	email: string;
	password: string;
	drives: DriveSchema[];
}

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
