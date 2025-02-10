import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { useEventSource } from './useEventSource';
import { config } from '../configs/common';
import { getChanges } from '../redux/async-actions/drives.async.actions';
import { useEventSourceEvents } from './useEventSourceEvents';
import { validateEventData } from '../sse/validateEventData';
import { isValidServerSideEventData } from '../sse/validators';
import { useGetDrivesQuery, useWatchDriveChangesQuery } from '../redux/rtk/driveApi';

const DRIVE_NOTIFICATION_SUBSCRIPTION_URL = `${config.baseURL}/drives/subscribe`;

export const useServerSideEvents = () => {
	const dispatch = useAppDispatch();
	const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const { data: drives = [], isSuccess } = useGetDrivesQuery();
	const { data: watchChangesChannels = [] } = useWatchDriveChangesQuery(
		{ driveIds: drives.map(drive => drive.id) },
		{ skip: !isUserAuthenticated || drives.length === 0 }
	);

	const handleServerSideEvent = useCallback(
		(event: MessageEvent<string>) => {
			const validationResult = validateEventData(event.data, isValidServerSideEventData);
			if (!validationResult.isValid) {
				return;
			}

			const eventData = validationResult.data;
			if (eventData.change == 'change') {
				const channel = watchChangesChannels.find(
					channel => channel.driveId === eventData.driveId
				);
				if (!channel) {
					return;
				}

				dispatch(
					getChanges({
						driveId: channel.driveId,
						startPageToken: channel.startPageToken ?? '-',
					})
				);
			}
		},
		[dispatch, watchChangesChannels]
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
		if (isUserAuthenticated && isSuccess) {
			openStream();
		}
	}, [isSuccess, isUserAuthenticated, openStream]);
};
