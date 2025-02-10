import localtunnel, { Tunnel } from 'localtunnel';
import { LOCALTUNNEL_SUBDOMAIN } from './subdomain';

type TunnelOpts = {
	port: number;
	subdomain?: string;
};

const TAG = '[localtunnel]';

export const createTunnel = async ({
	port,
	subdomain = LOCALTUNNEL_SUBDOMAIN,
}: TunnelOpts): Promise<Tunnel | undefined> => {
	try {
		console.log(`${TAG}: Creating tunnel...`);
		const tunnel = await localtunnel({
			port: port,
			subdomain: subdomain,
		});

		tunnel.once('close', reason => {
			console.log(`${TAG}: Tunnel closed, Reason: ${reason}`);
		});

		console.log(`${TAG}: Tunnel connection established, URL: '${tunnel.url}'`);

		return tunnel;
	} catch (err) {
		console.error(`${TAG}: Tunnel error has occurred, Error: '${(err as Error).message}'`);
	}
};
