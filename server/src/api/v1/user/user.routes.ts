import express, { Router } from 'express';
import {
	registerUserController,
	loginUserController,
	logoutUserController,
} from './user.controllers';

const router: Router = express.Router();
router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/login', logoutUserController);

export default router;
