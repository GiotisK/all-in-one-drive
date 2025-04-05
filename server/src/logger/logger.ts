import winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${message} ${JSON.stringify(meta)}`;
});

const dailyRotateTransport = new winston.transports.DailyRotateFile({
	filename: 'logs/app-%DATE%.log',
	datePattern: 'DD-MM-YYYY-MM',
	zippedArchive: true,
	maxSize: '10m',
	maxFiles: '2d',
});

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.timestamp(), logFormat),
	transports: [
		dailyRotateTransport,
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp(),
				logFormat
			),
		}),
	],
});

const baseDriveLogger = (
	strategy: 'GoogleDriveStrategy' | 'DropboxStrategy',
	functionName: string,
	details: object = {},
	type: 'info' | 'error' = 'error'
) => {
	if (type === 'error') {
		logger.error(`[${strategy}]: ${functionName}:`, {
			...details,
		});
	} else {
		logger.info(`[${strategy}]: ${functionName}:`, {
			...details,
		});
	}
};

export const dropboxLogger = (
	functionName: string,
	details: object = {},
	type: 'info' | 'error' = 'error'
) => {
	baseDriveLogger('DropboxStrategy', functionName, details, type);
};

export const googleDriveLogger = (
	functionName: string,
	details: object = {},
	type: 'info' | 'error' = 'error'
) => {
	baseDriveLogger('GoogleDriveStrategy', functionName, details, type);
};

export default logger;
