import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { useEventSource } from './useEventSource';
import { config } from '../configs/common';
import { getChanges } from '../redux/async-actions/drives.async.actions';
import { useEventSourceEvents } from './useEventSourceEvents';
import { validateEventData } from '../sse/validateEventData';
import { isValidServerSideEventData } from '../sse/validators';

const DRIVE_NOTIFICATION_SUBSCRIPTION_URL = `${config.baseURL}/drives/subscribe`;

export const useServerSideEvents = () => {
	const dispatch = useAppDispatch();
	const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const getDrivesRequest = useAppSelector(state => state.drives.requests.getDrives);
	const { drives } = useAppSelector(state => state.drives);

	const handleServerSideEvent = useCallback(
		(event: MessageEvent<string>) => {
			const validationResult = validateEventData(event.data, isValidServerSideEventData);
			if (!validationResult.isValid) {
				return;
			}

			const eventData = validationResult.data;
			if (eventData.change == 'change') {
				const drive = drives.find(drive => drive.email === eventData.driveEmail);
				if (!drive) {
					console.log(
						'Could not find drive to request changes for email: ',
						eventData.driveEmail
					);
					return;
				}

				dispatch(
					getChanges({
						email: drive.email,
						startPageToken: drive.watchChangesChannel?.startPageToken ?? '-',
					})
				);
			}
		},
		[dispatch, drives]
	);

	const { eventSource, openStream } = useEventSource({
		url: DRIVE_NOTIFICATION_SUBSCRIPTION_URL,
	});

	useEventSourceEvents({
		eventSource,
		listeners: [
			{
				eventName: 'connected',
				listener: () => {
					console.log('[SSE]-[connected]');
				},
			},
			{
				eventName: 'update-event',
				listener: (event: MessageEvent<string>) => {
					console.log('[SSE]-[update-event]:', JSON.parse(event.data));
					handleServerSideEvent(event);
				},
			},
		],
	});

	useEffect(() => {
		if (isUserAuthenticated && getDrivesRequest.done) {
			openStream();
		}
	}, [getDrivesRequest.done, isUserAuthenticated, openStream]);
};
