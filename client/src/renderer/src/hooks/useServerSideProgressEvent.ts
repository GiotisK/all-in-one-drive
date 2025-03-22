import { useCallback } from 'react';

import { validateEventData } from '../sse/validateEventData';
import { isServerSideEventProgressData } from '../sse/validators';
import { useEventSourceEvents } from './useEventSourceEvents';
import { usePendingFilesContext } from './usePendingFilesContext';

export const useServerSideProgressEvent = (eventSource: EventSource | null) => {
	const { handleNewPendingFile } = usePendingFilesContext();

	const handleProgressServerSideEvent = useCallback(
		(eventData: string) => {
			console.log('[SSE]-[progress]:', eventData);

			const validationResultForProgressData = validateEventData(
				eventData,
				isServerSideEventProgressData
			);

			if (!validationResultForProgressData.isValid) {
				return;
			}

			handleNewPendingFile(validationResultForProgressData.data);
		},
		[handleNewPendingFile]
	);

	useEventSourceEvents({
		eventSource,
		listeners: [
			{
				eventName: 'download-progress-event',
				listener: (event: MessageEvent<string>) => {
					console.log('[SSE]-[download-progress-event]:', JSON.parse(event.data));
					handleProgressServerSideEvent(event.data);
				},
			},
			{
				eventName: 'upload-progress-event',
				listener: (event: MessageEvent<string>) => {
					console.log('[SSE]-[upload-progress-event]:', JSON.parse(event.data));
					handleProgressServerSideEvent(event.data);
				},
			},
		],
	});
};
