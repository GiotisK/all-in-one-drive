import { ServerSideEventData } from '../shared/types/global.types';

export type Validator<T> = (data: unknown) => data is T;

// TODO: Think this through. For now it suffices as a sanity check. But kinda overkill.
export const isValidServerSideEventData = (data: unknown): data is ServerSideEventData => {
	return (
		data !== null &&
		typeof data === 'object' &&
		'driveType' in data &&
		typeof data.driveType === 'string' &&
		'driveEmail' in data &&
		typeof data.driveEmail === 'string' &&
		'change' in data &&
		typeof data.change === 'string' &&
		['change', 'sync'].includes(data.change)
	);
};
