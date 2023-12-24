import express, { Router } from 'express';
import {
	registerUserController,
	loginUserController,
	logoutUserController,
	authUserController,
} from './user.controllers';
import authorize from '../../../middleware/authorize';

const router: Router = express.Router();
router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/logout', logoutUserController);
router.get('/auth', authorize, authUserController);

export default router;
