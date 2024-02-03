import express, { Router } from 'express';
import authorize from '../../../../middleware/authorize';
import {
	deleteFileController,
	getRootFilesController,
	editFileController,
} from './drives.files.controllers';

const router: Router = express.Router();
router.get('/files', authorize, getRootFilesController);
router.delete('/:drive/:email/files/:fileId', authorize, deleteFileController);
router.patch('/:drive/:email/files/:fileId', authorize, editFileController);

export default router;
