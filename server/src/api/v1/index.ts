import userRouter from './user/user.routes';
import drivesRouter from './drives/drives.routes';
import drivesFilesRouter from './drives/files/virtual/drives.virtual.files.routes';
import googleDriveFilesRouter from './drives/files/googledrive/drives.googledrive.files.routes';
import virtualDriveRouter from './drives/virtual/drives.virtual.routes';
import virtualDriveFilesRouter from './drives/files/virtual/drives.virtual.files.routes';

export {
	userRouter,
	drivesRouter,
	drivesFilesRouter,
	googleDriveFilesRouter,
	virtualDriveRouter,
	virtualDriveFilesRouter,
};
