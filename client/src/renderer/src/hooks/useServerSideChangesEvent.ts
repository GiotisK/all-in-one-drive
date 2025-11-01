import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/store/store';
import {
    useGetDriveChangesQuery,
    useGetDrivesQuery,
    useWatchDriveChangesQuery,
} from '../redux/rtk/driveApi';
import { validateEventData } from '../sse/validateEventData';
import { isServerSideEventChangeData } from '../sse/validators';
import { useEventSourceEvents } from './useEventSourceEvents';

type GetChangesParams = { driveId: string; startPageToken: string };

export const useServerSideChangesEvent = (eventSource: EventSource | null) => {
    const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const { data: drives = [] } = useGetDrivesQuery();
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

    const handleChangesServerSideEvent = useCallback(
        (eventData: string) => {
            const validationResultForChangeData = validateEventData(
                eventData,
                isServerSideEventChangeData
            );

            if (!validationResultForChangeData.isValid) {
                return;
            }

            const { change, driveId } = validationResultForChangeData.data;

            if (change == 'change') {
                const channel = watchChangesChannels.find(channel => channel.driveId === driveId);
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

    useEventSourceEvents({
        eventSource,
        listeners: [
            {
                eventName: 'update-event',
                listener: (event: MessageEvent<string>) => {
                    console.log('[SSE]-[update-event]:', JSON.parse(event.data));
                    handleChangesServerSideEvent(event.data);
                },
            },
        ],
    });
};
