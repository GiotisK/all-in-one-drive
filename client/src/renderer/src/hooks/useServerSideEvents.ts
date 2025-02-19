import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/store/store';
import { useEventSource } from './useEventSource';
import { config } from '../configs/common';
import { useEventSourceEvents } from './useEventSourceEvents';
import { validateEventData } from '../sse/validateEventData';
import { isValidServerSideEventData } from '../sse/validators';
import {
	useGetDrivesQuery,
	useWatchDriveChangesQuery,
	useGetDriveChangesQuery,
} from '../redux/rtk/driveApi';

type GetChangesParams = { driveId: string; startPageToken: string };

const DRIVE_NOTIFICATION_SUBSCRIPTION_URL = `${config.baseURL}/drives/subscribe`;

export const useServerSideEvents = () => {
	const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const { data: drives = [], isSuccess: getDrivesSuccesss } = useGetDrivesQuery();
	const { data: watchChangesChannels = [] } = useWatchDriveChangesQuery(
		{ driveIds: drives.map(drive => drive.id) },
		{ skip: !isUserAuthenticated || drives.length === 0 }
	);
	const [driveChangesParams, setDriveChangesParams] = useState<GetChangesParams | null>(null);
	const { isSuccess: driveChangesSuccess, refetch } = useGetDriveChangesQuery(
		{
			driveId: driveChangesParams?.driveId ?? '',
			startPageToken: driveChangesParams?.startPageToken ?? '',
		},
		{ skip: driveChangesParams === null }
	);

	useEffect(() => {
		if (driveChangesSuccess) {
			setDriveChangesParams(null);
		}
	}, [driveChangesSuccess]);

	useEffect(() => {
		if (driveChangesParams !== null) {
			refetch();
		}
	}, [driveChangesParams, refetch]);

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

				console.log('[SSE]-[change]:', eventData);

				setDriveChangesParams({
					driveId: channel.driveId,
					startPageToken: channel.startPageToken,
				});
			}
		},
		[watchChangesChannels]
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
		if (isUserAuthenticated && getDrivesSuccesss) {
			openStream();
		}
	}, [getDrivesSuccesss, isUserAuthenticated, openStream]);
};
