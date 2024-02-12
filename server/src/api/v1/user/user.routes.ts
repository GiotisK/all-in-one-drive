import express, { Router } from 'express';
import UserController from './user.controllers';
import authorize from '../../../middleware/authorize';

const router: Router = express.Router();
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', authorize, UserController.logoutUser);
router.get('/auth', authorize, UserController.authUser);

export default router;
