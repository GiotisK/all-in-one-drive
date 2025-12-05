import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import {
	userRouter,
	drivesRouter,
	drivesFilesRouter,
	googleDriveFilesRouter,
	virtualDriveRouter,
	virtualDriveFilesRouter,
} from './src/api/v1/';
import { createTunnel } from './src/tunnel/localtunnel';

const app = express();
const port = parseInt(process.env.PORT || '8000');
const frontendURL = process.env.FRONTEND_URL;

createTunnel({ port });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: frontendURL, credentials: true }));
app.use(cookieparser());
app.use('/users', userRouter);
app.use('/drives/virtual', [virtualDriveRouter, virtualDriveFilesRouter]);
app.use('/drives/googledrive/:driveId/files', googleDriveFilesRouter);
app.use('/drives', [drivesRouter, drivesFilesRouter]);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = app;
