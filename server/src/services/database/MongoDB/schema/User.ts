import mongoose from 'mongoose';
import { MongoDBUserSchema } from '../types';

const userSchema = new mongoose.Schema<MongoDBUserSchema>({
	email: { type: String, required: true, unique: true },
	password: { type: String },
	drives: [
		{
			_id: String,
			email: String,
			virtualFolderId: { type: String, default: '' },
			token: String,
			driveType: String,
		},
	],
});

export const User = mongoose.model<MongoDBUserSchema>('User', userSchema);
