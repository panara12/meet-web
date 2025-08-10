const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDirectory = path.resolve(__dirname, '../../logs/backend');


// Common format for all logs
const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} | ${level.toUpperCase()} | ${message}`;
});

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: path.join(logDirectory, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '5d', // keep logs for 5 days
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.simple()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.resolve(__dirname, '../../logs/backend/errors.log'), level: 'error' }),
    new transports.File({ filename: path.resolve(__dirname, '../../logs/backend/combined.log') }),
    new transports.File({ filename: path.join(__dirname, '../logs/backend/tracker.log'), level: 'info' })
  ]
});

module.exports = logger;
