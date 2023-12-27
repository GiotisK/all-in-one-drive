import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthLocals } from '../types/types';
import { Status } from '../types/global.types';

export default function (req: Request, res: Response, next: () => any) {
	const secret = process.env.JWT_SECRET!;
	const token = req.cookies.token;

	try {
		const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
		(res.locals as AuthLocals).email = decoded.email;
		next();
	} catch (err) {
		res.status(Status.UNAUTHORIZED).send();
	}
}
