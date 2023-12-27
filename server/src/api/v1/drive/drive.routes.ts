import express, { Router } from 'express';
import authorize from '../../../middleware/authorize';
import { authLinkController, connectDriveController } from './drive.controllers';
//TODO: remove comments
const router: Router = express.Router();
router.get('/:drive/authlink', /* authorize,  */ authLinkController);
router.post('/:drive/connect', /* authorize, */ connectDriveController);

export default router;
