const logger = require('./logger');

const manualLog = (message) => {
  // Use logger.info() instead of logger.log()
  logger.info(`[MANUAL] ${message}`);
};

module.exports = manualLog;