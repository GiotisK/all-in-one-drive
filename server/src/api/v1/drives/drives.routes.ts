import express, { Router } from 'express';
import authorize from '../../../middleware/authorize';
import DrivesController from './drives.controllers';

const router: Router = express.Router();
router.get('/', authorize, DrivesController.getDrives);
router.get('/:drive/authlink', authorize, DrivesController.authLink);
router.get('/:drive/quota/:email', authorize, DrivesController.getDriveQuota);
router.post('/:drive/connect', authorize, DrivesController.connectDrive);
router.delete('/:drive/:email', authorize, DrivesController.deleteDrive);

export default router;
