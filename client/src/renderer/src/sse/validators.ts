import {
	ServerSideEventChangeData,
	ServerSideEventProgressData,
} from '../shared/types/global.types';

export type Validator<T> = (data: unknown) => data is T;

export const isServerSideEventChangeData = (data: unknown): data is ServerSideEventChangeData => {
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

export const isServerSideEventProgressData = (
	data: unknown
): data is ServerSideEventProgressData => {
	return (
		data !== null &&
		typeof data === 'object' &&
		'fileId' in data &&
		typeof data.fileId === 'string' &&
		'driveId' in data &&
		typeof data.driveId === 'string' &&
		'name' in data &&
		typeof data.name === 'string' &&
		'operationUuid' in data &&
		typeof data.operationUuid === 'string' &&
		'type' in data &&
		typeof data.type === 'string' &&
		['upload', 'download']?.includes(data.type) &&
		'percentage' in data &&
		typeof data.percentage === 'number'
	);
};
