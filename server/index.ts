import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import { userRouter, drivesRouter, drivesFilesRouter } from './src/api/v1/';
import { connectDB } from './src/configs/database/database.config';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const frontendURL = process.env.FRONTEND_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TODO: check if cors needed later on
app.use(cors({ origin: frontendURL, credentials: true }));
app.use(cookieparser());
app.use('/users', userRouter);
app.use('/drives', [drivesRouter, drivesFilesRouter]);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

connectDB();

module.exports = app;
