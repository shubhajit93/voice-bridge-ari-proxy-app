import winston from 'winston';
import 'winston-daily-rotate-file';

import { config } from '../config/config.js';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  });

const consoleTransport =  new winston.transports.Console();

const logger = winston.createLogger({
    level: config.logger.logLevel,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        consoleTransport,
        fileRotateTransport
    ]
});

export default logger;