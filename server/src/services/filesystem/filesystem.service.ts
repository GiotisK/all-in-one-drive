import fs from 'fs';
import internal from 'stream';

class FileSystemService {
	public saveFileToDownloads(data: internal.Readable, name: string, extension?: string) {
		var writeStream = fs.createWriteStream(
			this.getDefaultSavePathForFile(name, extension ?? '')
		);

		data.pipe(writeStream);

		writeStream.on('finish', function () {
			//todo: send event to frontend
			writeStream.end();
		});
		writeStream.on('error', function () {
			//todo: send event to frontend
			writeStream.end();
		});
	}

	private getDefaultSavePathForFile(fileName: string, fileExtension: string) {
		const fileExtensionWithDot = fileExtension ? '.' + fileExtension : '';

		return process.env.USERPROFILE + '/Downloads/' + fileName + fileExtensionWithDot;
	}
}

export default new FileSystemService();
