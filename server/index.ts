import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { userRouter } from './src/api/v1/';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const frontendURL = process.env.FRONTEND_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TODO: check if cors needed later on
app.use(cors({ origin: frontendURL, credentials: true }));

app.use('/users', userRouter);

app.post('/users/register', (req: Request, res: Response) => {
	console.log('get received');
	res.send('get received');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = app;
