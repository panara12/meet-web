const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const logDirectory = path.resolve(__dirname, '../logs/backend');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Common format for all logs
const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} | ${level.toUpperCase()} | ${message}`;
});

// Daily rotate transport for error logs
const errorRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logDirectory, 'errors-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

// Daily rotate transport for combined logs
const combinedRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logDirectory, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d',
  zippedArchive: true,
});

// Daily rotate transport for tracker logs
const trackerRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logDirectory, 'tracker-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'info',
  maxSize: '20m',
  maxFiles: '7d',
  zippedArchive: true,
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    errorRotateTransport,
    combinedRotateTransport,
    trackerRotateTransport
  ]
});

// Log transport initialization
logger.info('Logger initialized with daily rotation');

module.exports = logger;