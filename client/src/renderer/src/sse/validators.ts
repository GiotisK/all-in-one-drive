import { ServerSideEventData } from '../shared/types/global.types';

export type Validator<T> = (data: unknown) => data is T;

export const isValidServerSideEventData = (data: unknown): data is ServerSideEventData => {
	return (
		data !== null &&
		typeof data === 'object' &&
		'driveType' in data &&
		typeof data.driveType === 'string' &&
		'driveId' in data &&
		typeof data.driveId === 'string' &&
		'change' in data &&
		typeof data.change === 'string' &&
		['change', 'sync'].includes(data.change)
	);
};
