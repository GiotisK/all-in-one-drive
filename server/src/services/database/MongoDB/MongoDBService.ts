import mongoose from 'mongoose';

export class MongoDBService {
	public async connect() {
		try {
			await mongoose.connect(process.env.MONGO_URI!);
			console.log('[database]: MongoDB is now connected');
		} catch (error: any) {
			console.log(error.message);
			process.exit(1);
		}
	}
}
