import express, { Router } from 'express';
import authorize from '../../../../middleware/authorize';
import FilesController from './drives.files.controllers';

const router: Router = express.Router();
router.get('/files', authorize, FilesController.getRootFiles);
router.get('/:driveId/files/:folderId', authorize, FilesController.getFolderFiles);
router.post('/:driveId/files', authorize, FilesController.createFile);
router.delete('/:driveId/files/:fileId', authorize, FilesController.deleteFile);
router.patch('/:driveId/files/:fileId', authorize, FilesController.editFile);

export default router;
