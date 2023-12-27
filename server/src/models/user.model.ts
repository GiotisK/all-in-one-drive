import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: { type: String, unique: true },
	password: { type: String },
	googledrive: [{ email: String, virtualFolderId: { type: String, default: '' }, token: String }],
	dropbox: [{ email: String, virtualFolderId: { type: String, default: '' }, token: String }],
	onedrive: [{ email: String, virtualFolderId: { type: String, default: '' }, token: String }],
});

export default mongoose.model('User', userSchema);
