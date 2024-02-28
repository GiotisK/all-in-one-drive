import express, { Router } from 'express';
import authorize from '../../../middleware/authorize';
import DrivesController from './drives.controllers';

const router: Router = express.Router();

router.get('/', authorize, DrivesController.getDrives);
router.get('/:drive/authlink', authorize, DrivesController.authLink);
router.get('/:driveId/quota', authorize, DrivesController.getDriveQuota);
router.get('/:driveId/changes', authorize, DrivesController.getChanges);
router.post('/:drive/connect', authorize, DrivesController.connectDrive);
router.delete('/:driveId', authorize, DrivesController.deleteDrive);

// TODO: Fix names
router.post('/watch', authorize, DrivesController.watchDrive);
router.post('/stopwatch', authorize, DrivesController.stopWatchDrive);

// GDRIVE - Notifications webhook
router.post('/webhook', DrivesController.driveNotification);

// Server Side Events (SSE)
router.get('/subscribe', authorize, DrivesController.driveSubscription);

export default router;
