import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthLocals } from '../types/types';

export default function (req: Request, res: Response, next: () => any) {
	const secret = process.env.JWT_SECRET!;
	const token = req.cookies.token;

	if (!token) {
		(res.locals as AuthLocals).isVerified = false;
		next();
	}

	try {
		const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

		(res.locals as AuthLocals).isVerified = true;
		(res.locals as AuthLocals).email = decoded.email;
	} catch (err) {
		(res.locals as AuthLocals).isVerified = false;
	} finally {
		next();
	}
}
