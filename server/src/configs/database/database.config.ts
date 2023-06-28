import mongoose, { ConnectOptions } from 'mongoose';

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions);
		console.log('[database]: MongoDB is now connected');
	} catch (error: any) {
		console.log(error.message);
		process.exit(1);
	}
};
