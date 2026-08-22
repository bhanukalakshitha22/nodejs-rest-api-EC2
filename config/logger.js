const winston = require('winston');
const path = require('path');

// Define log directory
const logDir = process.env.LOG_DIR || path.join(__dirname, '../logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Error log transport - only logs errors
const errorFileTransport = new winston.transports.File({
  filename: path.join(logDir, 'error.log'),
  level: 'error',
  maxsize: 20971520, // 20MB
  maxFiles: 5,
  format: logFormat
});

// Combined log transport - logs all levels
const combinedFileTransport = new winston.transports.File({
  filename: path.join(logDir, 'combined.log'),
  maxsize: 20971520, // 20MB
  maxFiles: 5,
  format: logFormat
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    errorFileTransport,
    combinedFileTransport
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      maxsize: 20971520,
      maxFiles: 5,
      format: logFormat
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 20971520,
      maxFiles: 5,
      format: logFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      maxsize: 20971520,
      maxFiles: 5,
      format: logFormat
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 20971520,
      maxFiles: 5,
      format: logFormat
    })
  ],
  exitOnError: false
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

module.exports = logger;
