import { useEffect } from 'react';
import { Nullable } from '../shared/types/global.types';

type EventSourceEventListener = {
    eventName: string;
    listener: (event: MessageEvent<string>) => void;
};

type UseEventSourceEventsOpts = {
    eventSource: Nullable<EventSource>;
    listeners: EventSourceEventListener[];
};

export const useEventSourceEvents = ({ eventSource, listeners }: UseEventSourceEventsOpts) => {
    useEffect(() => {
        if (!eventSource) {
            return;
        }

        listeners.forEach(({ eventName, listener }) => {
            eventSource.addEventListener(eventName, listener);
        });

        return () => {
            listeners.forEach(({ eventName, listener }) => {
                eventSource.removeEventListener(eventName, listener);
            });
        };
    }, [eventSource, listeners]);
};
