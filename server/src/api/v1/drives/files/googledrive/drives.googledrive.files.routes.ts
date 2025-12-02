import express from 'express';
import authorize from '../../../../../middleware/authorize';
import GoogleDriveFilesController from './drives.googledrive.files.controllers';

const router = express.Router({ mergeParams: true });

router.get('/:fileId/export/formats', authorize, GoogleDriveFilesController.getExportFormats);

router.get('/:fileId/export', authorize, GoogleDriveFilesController.exportFile);

export default router;
