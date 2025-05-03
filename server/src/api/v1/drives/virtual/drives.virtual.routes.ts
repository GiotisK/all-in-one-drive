import express, { Router } from 'express';
import authorize from '../../../../middleware/authorize';
import VirtualDriveController from './drives.virtual.controllers';

const router: Router = express.Router();
router.get('/quota', authorize, VirtualDriveController.getVirtualQuota);

export default router;
