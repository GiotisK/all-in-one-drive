import mongoose, { ConnectOptions } from "mongoose";
const { MONGO_URI } = process.env;

export const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI!, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		} as ConnectOptions);
		console.log("MongoDB connected");
	} catch (error: any) {
		console.log(error.message);
		process.exit(1);
	}
};
