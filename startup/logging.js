const winston = require("winston");

module.exports = function() {

  process.on("uncaughtException", ex => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", ex => {
    throw ex;
  });

  const file = new winston.transports.File({
    filename: 'logfile.log'
  });

  winston.add(file);
  winston.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
    
};
