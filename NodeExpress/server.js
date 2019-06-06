const morgan = require('morgan');
var winston  = require('./config/winston'),
	expressWinston = require('express-winston');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
const fs = require('node-fs');
const nodeMailer = require('nodemailer');

// Remove the X-Powered-By headers.
app.use(function (req, res, next) {  
  res.header("X-powered-by", "Blood, sweat, and tears.");
  next();
});

// schedule task to run on the server
/*
new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
*/	

const PORT = 4000;
var cookieParser = require('cookie-parser');


require('dotenv').config()
//cron file
require('./config/scheduler');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
mongoose.connect('mongodb://'+process.env.REACT_APP_DATABASE_IP+':27017/trainees', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
	console.log("MongoDB database connection established successfully");
	winston.log('info', "MongoDB database connection established successfully");
})

app.use('/trainee', require('./routes/trainee_routes'));
app.use('/admin', require('./routes/admin_routes'));
app.use('/auth', require('./routes/auth_routes'));
app.use('/settings', require('./routes/settings_routes'));
app.use('/privacy', require('./routes/privacy_routes'));

app.listen(PORT, function() {
	console.log("Server is running on Port: " + PORT);
    winston.log('info', "Server is running on Port: " + PORT);
})
