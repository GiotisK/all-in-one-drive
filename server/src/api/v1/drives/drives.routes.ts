import express, { Router } from 'express';
import authorize from '../../../middleware/authorize';
import {
	authLinkController,
	connectDriveController,
	driveQuotaController,
	getDrivesController,
} from './drives.controllers';
//TODO: remove comments
const router: Router = express.Router();
router.get('/', authorize, getDrivesController);
router.get('/:drive/authlink', authorize, authLinkController);
router.get('/:drive/quota/:email', authorize, driveQuotaController);
router.post('/:drive/connect', authorize, connectDriveController);

export default router;
