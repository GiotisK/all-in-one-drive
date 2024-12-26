import express, { Router } from 'express';
import authorize from '../../../../middleware/authorize';
import FilesController from './drives.files.controllers';

const router: Router = express.Router();
router.get('/files', authorize, FilesController.getRootFiles);
router.get('/:driveId/folders/:folderId/files', authorize, FilesController.getFolderFiles);
router.get('/:driveId/files/:fileId', authorize, FilesController.downloadFile);
router.post('/:driveId/files', authorize, FilesController.createFile);
router.delete('/:driveId/files/:fileId', authorize, FilesController.deleteFile);
router.patch('/:driveId/files/:fileId', authorize, FilesController.editFile);

export default router;
