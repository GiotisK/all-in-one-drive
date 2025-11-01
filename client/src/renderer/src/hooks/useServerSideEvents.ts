import { useEffect } from 'react';
import { useAppSelector } from '../redux/store/store';
import { useEventSource } from './useEventSource';
import { config } from '../configs/common';
import { useEventSourceEvents } from './useEventSourceEvents';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';
import { useServerSideChangesEvent } from './useServerSideChangesEvent';
import { useServerSideProgressEvent } from './useServerSideProgressEvent';
const DRIVE_NOTIFICATION_SUBSCRIPTION_URL = `${config.baseURL}/drives/subscribe`;

export const useServerSideEvents = () => {
    const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const { isSuccess: getDrivesSuccesss } = useGetDrivesQuery();

    const { eventSource, openStream } = useEventSource({
        url: DRIVE_NOTIFICATION_SUBSCRIPTION_URL,
    });

    useServerSideChangesEvent(eventSource);
    useServerSideProgressEvent(eventSource);

    useEventSourceEvents({
        eventSource,
        listeners: [
            {
                eventName: 'connected',
                listener: () => {
                    console.log('[SSE]-[connected]');
                },
            },
        ],
    });

    useEffect(() => {
        if (isUserAuthenticated) {
            openStream();
        }
    }, [getDrivesSuccesss, isUserAuthenticated, openStream]);
};
