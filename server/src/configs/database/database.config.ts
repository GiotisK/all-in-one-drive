import mongoose from 'mongoose';

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log('[database]: MongoDB is now connected');
	} catch (error: any) {
		console.log(error.message);
		process.exit(1);
	}
};
