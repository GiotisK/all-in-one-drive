import express, { Router } from 'express';
import authorize from '../../../../../middleware/authorize';
import upload from '../../../../../middleware/multer-upload';
import FilesController from './drives.virtual.files.controllers';

const router: Router = express.Router();
router.get('/folders/:folderId/files', authorize, FilesController.getFolderFiles);
router.get('/files/:fileId/download', authorize, FilesController.downloadFile);
router.get('/files/:fileId/open', authorize, FilesController.openFile);
router.get('/files/:fileId/thumbnailLink', authorize, FilesController.getThumbnailLink);

router.post('/files', authorize, FilesController.getRootFiles);
router.post('/files', authorize, FilesController.createFile);
router.post('/files/upload', authorize, upload.single('file'), FilesController.uploadFile);

router.delete('/files/:fileId', authorize, FilesController.deleteFile);

router.patch('/files/:fileId', authorize, FilesController.editFile);

export default router;
