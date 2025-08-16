const logger = require('./logger');

const manualLog = (message) => {
  logger.log({ level: 'info', message: `[MANUAL] ${message}` });
};

module.exports = manualLog;
