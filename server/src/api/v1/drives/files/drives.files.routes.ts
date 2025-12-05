import express, { Router } from 'express';
import authorize from '../../../../middleware/authorize';
import upload from '../../../../middleware/multer-upload';
import FilesController from './drives.files.controllers';

const router: Router = express.Router();
router.get('/:driveId/folders/:folderId/files', authorize, FilesController.getFolderFiles);
router.get('/:driveId/files/:fileId/download', authorize, FilesController.downloadFile);
router.get('/:driveId/files/:fileId/open', authorize, FilesController.openFile);
router.get('/:driveId/files/:fileId/thumbnailLink', authorize, FilesController.getThumbnailLink);

router.post('/:driveId/files', authorize, FilesController.getRootFiles);
router.post('/:driveId/files', authorize, FilesController.createFile);
router.post('/:driveId/files/upload', authorize, upload.single('file'), FilesController.uploadFile);

router.delete('/:driveId/files/:fileId', authorize, FilesController.deleteFile);

router.patch('/:driveId/files/:fileId', authorize, FilesController.editFile);

export default router;
