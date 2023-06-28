import express, { Router, Request, Response } from 'express';
import { registerUserController } from './user.controllers';

const router: Router = express.Router();
router.post('/register', registerUserController);

export default router;
