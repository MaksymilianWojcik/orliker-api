const winston = require('winston');

module.exports = function() {

  process.on('uncaughtException', ex => {
    winston.error(ex.message, ex);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });

  process.on('unhandledRejection', ex => {
    throw ex;
  });

  const file = new winston.transports.File({
    filename: 'logfile.log',
    level: 'error'
  });

  winston.add(file);
  winston.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
    
};
