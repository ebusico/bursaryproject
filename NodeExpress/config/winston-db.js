var winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;

function createLogger(label){
    var logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.MongoDB({
        level: 'info',
        label: label,
        db: 'mongodb://localhost:27017/trainees',
        collection: 'log'
      })
    ],
    exitOnError: false, // do not exit on handled exceptions
  });
  return logger;
}

module.exports = {createLogger};