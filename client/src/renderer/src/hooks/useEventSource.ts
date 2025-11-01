import { useCallback, useEffect, useRef, useState } from 'react';

export interface EventSourceOpts {
    url: string | URL;
    autoConnect?: boolean;
    opts?: EventSourceInit;
}

const EventSourceReadyState = {
    Connecting: 'Connecting',
    Open: 'Open',
    Closed: 'Closed',
} as const;
type EventSourceReadyState = (typeof EventSourceReadyState)[keyof typeof EventSourceReadyState];

const TAG = '[useEventSource]';

export const useEventSource = ({
    url,
    autoConnect = false,
    opts: { withCredentials = true } = {},
}: EventSourceOpts) => {
    const eventSourceRef = useRef<EventSource | null>(null);
    const [error, setError] = useState<Event>();
    const [readyState, setReadyState] = useState<EventSourceReadyState>('Connecting');

    const openStream = useCallback(() => {
        if (eventSourceRef.current?.readyState === EventSource.OPEN) {
            return;
        }

        eventSourceRef.current = new EventSource(url, { withCredentials });

        eventSourceRef.current.onopen = () => {
            console.log(`${TAG} onopen`);
            setReadyState('Open');
        };

        eventSourceRef.current.onerror = (error: Event) => {
            console.log(`${TAG} onerror, error: ${error}`);
            setReadyState('Closed');
            setError(error);
        };
    }, [url, withCredentials]);

    const closeStream = useCallback(() => {
        if (!eventSourceRef.current) {
            return;
        }

        eventSourceRef.current.close();
        eventSourceRef.current = null;
    }, []);

    useEffect(() => {
        if (autoConnect) {
            openStream();
        }

        return () => {
            closeStream();
        };
    }, [autoConnect, closeStream, openStream]);

    return {
        eventSource: eventSourceRef.current,
        readyState,
        error,
        openStream,
        closeStream,
    };
};

export type UseEventSourceReturn = ReturnType<typeof useEventSource>;
