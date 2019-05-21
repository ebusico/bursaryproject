const morgan = require('morgan');
var winston  = require('./config/winston'),
	expressWinston = require('express-winston');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 4000;

var cookieParser = require('cookie-parser');


require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


mongoose.connect('mongodb://34.245.236.104:27017/trainees', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
	console.log("MongoDB database connection established successfully");
	winston.log('info', "MongoDB database connection established successfully");
})

app.use('/trainee', require('./routes/trainee_routes'));
app.use('/admin', require('./routes/admin_routes'));
app.use('/auth', require('./routes/auth_routes'));

app.listen(PORT, function() {
	console.log("Server is running on Port: " + PORT);
    winston.log('info', "Server is running on Port: " + PORT);
})
