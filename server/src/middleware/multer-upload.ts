import multer from 'multer';
import os from 'os';

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, os.tmpdir());
	},
	filename: function (_req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

export default upload;
