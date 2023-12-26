import express, { Router } from 'express';
import authorize from '../../../middleware/authorize';
import { authLinkController } from './drive.controllers';

const router: Router = express.Router();
router.get('/:drive/authlink', authorize, authLinkController);

export default router;
