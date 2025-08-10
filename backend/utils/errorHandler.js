const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}\n${err.stack}`);
  res.status(500).json({ message: 'Something broke!' });
};

module.exports = errorHandler;
