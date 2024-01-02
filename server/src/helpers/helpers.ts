export const bytesToGigabytes = (bytesStr: string): string => {
	const bytes = parseFloat(bytesStr);

	return (bytes / Math.pow(2, 30)).toString();
};
