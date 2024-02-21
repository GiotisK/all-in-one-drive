const generateSubdomain = (): string => {
	const timestamp = Date.now().toString(36);
	return `all-in-one-drive-${timestamp}`;
};

export const LOCALTUNNEL_SUBDOMAIN = generateSubdomain();
export const LOCALTUNNEL_URL = `https://${LOCALTUNNEL_SUBDOMAIN}.loca.lt`;
