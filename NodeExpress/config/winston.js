const appRoot = require('app-root-path');
const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
const path = require('path');

//Set up winston logger
const logger = createLogger({
	level: 'info',
	handleExceptions: true,
	//maxsize:5242880, //5MB
	//maxFiles: 5,
	format: format.combine(
		format.json(),
		format.label({ label: path.basename(process.mainModule.filename) }),
		format.timestamp({
			format: 'DD-MM-YYYY HH:mm:ss'
	}),
		format.printf(
		info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
	),
	transports: [
	new transports.File({ filename: 'logs/server_logs.log', level: 'info' }),
	],
	
	exitonError: false, // Will not exit on handled exceptions
});

//Will allow morgan package to stream with the winston log files.
logger.stream = {
	write: function(message, encoding){
		// using the 'info' log level so the output will be picked up
		logger.info(message);
	},
};


module.exports = logger;


