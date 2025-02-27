import { useCallback } from 'react';

import { validateEventData } from '../sse/validateEventData';
import { isServerSideEventProgressData } from '../sse/validators';
import { useEventSourceEvents } from './useEventSourceEvents';

export const useServerSideProgressEvent = (eventSource: EventSource | null) => {
	const handleProgressServerSideEvent = useCallback((eventData: string) => {
		console.log('[SSE]-[progress]:', eventData);

		const validationResultForProgressData = validateEventData(
			eventData,
			isServerSideEventProgressData
		);

		if (!validationResultForProgressData.isValid) {
			return;
		}

		const { driveId, percentage, type, fileId } = validationResultForProgressData.data;

		console.log(driveId, percentage, type, fileId);

		//todo handle percentages here
	}, []);

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
		],
	});
};
