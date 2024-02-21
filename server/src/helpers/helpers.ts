import { v4 as uuidv4 } from 'uuid';

export const bytesToGigabytes = (bytesStr: string): string => {
	const bytes = parseFloat(bytesStr);

	return (bytes / Math.pow(2, 30)).toFixed(2).toString();
};

export const normalizeBytes = (bytesStr: string) => {
	const bytes = parseInt(bytesStr);
	if (bytes === 0 || bytes === undefined) return '-';

	const decimals = 2;
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

	return value ? value + ' ' + sizes[i] : '-';
};

export const generateUUID = (): string => {
	return uuidv4();
};
