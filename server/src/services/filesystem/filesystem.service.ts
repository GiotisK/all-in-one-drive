import fs from 'fs';
import internal from 'stream';
import open from 'open';
import os from 'os';

class FileSystemService {
	public saveFileToDownloads(data: internal.Readable, name: string, extension?: string) {
		const filePath = this.getDownloadsSavePathForFile(name, extension ?? '');
		const writeStream = fs.createWriteStream(filePath);

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

	public saveFileToTemp(
		data: internal.Readable,
		name: string,
		extension?: string,
		shouldOpenNative?: boolean
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const tempPath = this.getTempSavePathForFile(name, extension ?? '');
			const writeStream = fs.createWriteStream(tempPath);

			data.pipe(writeStream);

			writeStream.on('finish', function () {
				if (shouldOpenNative) {
					open(tempPath);
				}

				writeStream.end();
				resolve(tempPath);
			});

			writeStream.on('error', function () {
				writeStream.end();
				reject(null);
			});
		});
	}

	private getTempSavePathForFile(fileName: string, fileExtension: string) {
		const fileExtensionWithDot = fileExtension ? '.' + fileExtension : '';

		return os.tmpdir() + '\\' + fileName + fileExtensionWithDot;
	}

	private getDownloadsSavePathForFile(fileName: string, fileExtension: string) {
		const fileExtensionWithDot = fileExtension ? '.' + fileExtension : '';

		return process.env.USERPROFILE + '/Downloads/' + fileName + fileExtensionWithDot;
	}
}

export default new FileSystemService();
