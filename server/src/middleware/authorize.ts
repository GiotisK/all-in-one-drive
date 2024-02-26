import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthLocals } from '../types/types';
import { Status } from '../types/global.types';

export default function (req: Request, res: Response<{}, AuthLocals>, next: () => any) {
	const secret = process.env.JWT_SECRET!;
	const token = req.cookies.token;

	try {
		//TODO: check if its enough. what happens if you send your own cookie ?
		//TODO FIX ALL, User deleted
		const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
		res.locals.email = decoded.email;
		next();
	} catch (err) {
		res.status(Status.UNAUTHORIZED).send();
	}
}
