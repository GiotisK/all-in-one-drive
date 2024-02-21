import express, { Router } from 'express';
import authorize from '../../../middleware/authorize';
import DrivesController from './drives.controllers';

const router: Router = express.Router();

router.get('/', authorize, DrivesController.getDrives);
router.get('/:drive/authlink', authorize, DrivesController.authLink);
router.get('/:drive/quota/:email', authorize, DrivesController.getDriveQuota);
router.get('/:drive/changes/:email', authorize, DrivesController.getChanges);
router.post('/:drive/connect', authorize, DrivesController.connectDrive);
router.delete('/:drive/:email', authorize, DrivesController.deleteDrive);

// TODO: Fix names
router.post('/watch', authorize, DrivesController.watchDrive);
router.post('/stopwatch', authorize, DrivesController.stopWatchDrive);

// GDRIVE - Notifications webhook
router.post('/webhook', DrivesController.driveNotification);

// Server Side Evens (SSE)
router.get('/subscribe', authorize, DrivesController.driveSubscription);

export default router;
