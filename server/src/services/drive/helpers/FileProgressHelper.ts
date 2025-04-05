import internal from 'stream';
import { generateUUID } from '../../../helpers/helpers';
import { FileOperationType, ServerSideEventProgressData } from '../../../types/global.types';
import SSEManager from '../../sse/SSEManager';

type FileData = {
	name: string;
	size: number;
	driveId: string;
	fileId: string;
};

class FileProgressHelper {
	public sendFileProgressEvent(
		data: internal.Readable,
		type: FileOperationType,
		{ driveId, fileId, name, size }: FileData
	) {
		let downloadedSize = 0;
		let lastLoggedPercent = 0;
		const operationUuid = generateUUID();

		data.on('data', chunk => {
			downloadedSize += chunk.length;
			const percent = Math.floor((downloadedSize / size) * 100);
			if (percent >= lastLoggedPercent + 10) {
				lastLoggedPercent = percent;
				const progressData: ServerSideEventProgressData = {
					name,
					operationUuid,
					fileId,
					driveId,
					type,
					percentage: percent,
				};
				SSEManager.sendNotification(type + '-progress-event', progressData);
			}
		});

		data.on('end', () => {
			const progressData: ServerSideEventProgressData = {
				name,
				operationUuid,
				fileId,
				driveId,
				type,
				percentage: 100,
			};
			SSEManager.sendNotification(type + '-progress-event', progressData);
		});
	}
}

export default new FileProgressHelper();
