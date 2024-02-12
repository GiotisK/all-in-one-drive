import express, { Router } from 'express';
import authorize from '../../../../middleware/authorize';
import FilesController from './drives.files.controllers';

const router: Router = express.Router();
router.get('/files', authorize, FilesController.getRootFiles);
router.get('/:drive/:email/files/:folderId', authorize, FilesController.getFolderFiles);
router.delete('/:drive/:email/files/:fileId', authorize, FilesController.deleteFile);
router.patch('/:drive/:email/files/:fileId', authorize, FilesController.editFile);

export default router;
