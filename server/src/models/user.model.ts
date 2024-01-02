import mongoose, { InferSchemaType } from 'mongoose';

export type DriveSchema = {
	email: string;
	virtualFolderId: string;
	token: string;
};

export interface UserSchema {
	email: string;
	password: string;
	googledrive: DriveSchema[];
	dropbox: DriveSchema[];
	onedrive: DriveSchema[];
}

const userSchema = new mongoose.Schema<UserSchema>({
	email: { type: String, unique: true },
	password: { type: String },
	googledrive: [{ email: String, virtualFolderId: { type: String, default: '' }, token: String }],
	dropbox: [{ email: String, virtualFolderId: { type: String, default: '' }, token: String }],
	onedrive: [{ email: String, virtualFolderId: { type: String, default: '' }, token: String }],
});

export default mongoose.model<UserSchema>('User', userSchema);
