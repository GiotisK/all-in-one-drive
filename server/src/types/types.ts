import { Request, Response } from 'express';

export interface CustomRequest<T> extends Request {
	body: T;
}

export type AuthLocals = { isVerified: boolean; email: string };
