import express from 'express';
import authorize from '../../../../../middleware/authorize';
import GoogleDriveFilesController from './drives.googledrive.files.controllers';

const router = express.Router();

router.get(
	'/:driveId/files/:fileId/export/formats',
	authorize,
	GoogleDriveFilesController.getExportFormats
);

router.get('/:driveId/files/:fileId/export', authorize, GoogleDriveFilesController.exportFile);

export default router;
