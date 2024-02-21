import { Request, Response } from 'express';

/**
 * Manages Server-Sent Event (SSE) connections.
 */
export class SseManager {
	private sseClients: Response[] = [];
	private readonly TAG = '[SseManager]';

	public addClient(req: Request, res: Response): void {
		this.sseClients.push(res);
		console.log(
			`${this.TAG}: SSE client added, connected clients: ${this.getConnectedClientsCount()}`
		);

		this.setHeaders(res);
		this.sendEvent(res, 'connected');
		this.setOnClose(req, res);
	}

	public removeClient(res: Response): void {
		this.sseClients = this.sseClients.filter(client => client !== res);
		console.log(
			`${this.TAG}: SSE client removed, connected clients: ${this.getConnectedClientsCount()}`
		);
	}

	public sendNotification(eventname: string, data: any): void {
		this.sseClients.forEach(client => {
			this.sendEvent(client, eventname, data);
		});
	}

	public closeAllConnections(): void {
		this.sseClients.forEach(client => {
			this.removeClient(client);
			client.end();
		});
	}

	public getConnectedClientsCount(): number {
		return this.sseClients.length;
	}

	private sendEvent(res: Response, eventName: string, data?: any): void {
		res.write(`event: ${eventName}\n`);
		if (data) {
			res.write(`data: ${JSON.stringify(data)}\n`);
		}
		res.write('\n\n');
	}

	private setHeaders(res: Response): void {
		const headers = {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache',
		} as const;
		res.writeHead(200, headers);
	}

	private setOnClose(req: Request, res: Response): void {
		req.on('close', () => {
			this.removeClient(res);
			res.end();
		});
	}
}
