const fs = require('node-fs');
const CronJob = require('cron').CronJob;
const nodeMailer = require('nodemailer');
const winston = require('./winston');

var databaseLogger = require('../config/winston-db')
var moment = require('moment');
var businessDiff = require('moment-business-days');

const crypto = require('crypto');
var CryptoJS = require("crypto-js");
let hex = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
let iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

let Trainee = require('../models/trainee.model');

//Will start after 1am on the first every month
const onceMonth = new CronJob( '0 1 1 * *', function() {
	winston.info('Cron Job for Trainee working days for current month updated (automatic)');
	console.log("Cron Job has started");
    Trainee.find(function(err, trainee) {
      trainee.map(function(trainee){
        if(!trainee){
            res.status(404).send("trainee is not found");
            logger.error("Trainee not found");
            winston.error("Trainee not found");
        }else{
        // calculate amount of days
            let logger = databaseLogger.createLogger(trainee.trainee_email);
            let currentMonth = moment();
            let bursary = CryptoJS.AES.decrypt(trainee.bursary, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            let bursary_start = moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8));
            let bench_end = moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8));
            console.log(trainee);
            console.log("encrypted start: "+ trainee.trainee_start_date);
            console.log("encrypted start: "+ trainee.trainee_bench_end_date);
			console.log("start: "+bursary_start);
            console.log("end: "+bench_end.format("MM"));
            
            if(bursary == "False"){
                trainee.trainee_days_worked = 0;
                trainee.save().then(trainee => {
                    console.log('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
					winston.info('Trainee working days for current month updated (automatic)');
                })
            }else if(bursary_start.isSame(bench_end, "month")){
                let workedDays = 1 + moment(bursary_start).businessDiff(bench_end);
                console.log("same start end month, days:" + workedDays);
                trainee.trainee_days_worked = workedDays;
                trainee.save().then(trainee => {
                    console.log('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
					winston.info('Trainee working days for current month updated (automatic)');
                })
            }else if(currentMonth.isBefore(bursary_start, 'month')){
                console.log("Bursary starting in July, 0 days");
                trainee.trainee_days_worked = 0
                trainee.save().then(trainee => {
                    console.log('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
					winston.info('Trainee working days for current month updated (automatic)');
                })
            }else if(currentMonth.isAfter(bench_end, 'month')){
                console.log("Bursary ending in April, 0 days");
                trainee.trainee_days_worked = 0
                trainee.save().then(trainee => {
                    console.log('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
					winston.info('Trainee working days for current month updated (automatic)');
                })
            }else if(bursary_start.isSame(currentMonth, 'month')){
                let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").endOf('month');
                let workedDays = moment(start).businessDiff(end);
                console.log('current month is start date month, days worked: ' + workedDays);
				console.log(start);
				console.log(end);
                trainee.trainee_days_worked = workedDays;
                trainee.save().then(trainee => {
                    console.log('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
					winston.info('Trainee working days for current month updated (automatic)');
                })
            }else if(bench_end.isSame(currentMonth, "month")){
                let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").startOf('month');
                let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                let workedDays = 1 + moment(start).businessDiff(end);
                console.log('current month is end date month, days:' + workedDays);
                trainee.trainee_days_worked = workedDays;
                trainee.save().then(trainee => {
                    console.log('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
					winston.info('Trainee working days for current month updated (automatic)');
                })
            }
            else{
				let start = moment().startOf('month');
				let end = moment().endOf('month');
				console.log(start);
				console.log(end)
                console.log("All days: "+moment(start).businessDiff(end));
                let workedDays = moment(start).businessDiff(end);
				trainee.trainee_days_worked = workedDays;
					trainee.save().then(trainee => {
                    console.log('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
					winston.info('Trainee working days for current month updated (automatic)');
                })
            }
          }
        });     
 });
}, null, true, 'Europe/London');
onceMonth.start();

// Send Trainee an email if they have not updated thier password
const autoEmail =  new CronJob('00 30 11 * * 1-5', function() {
	 pending = [];
	 Trainee.find(function(err, trainee) {
		trainee.map(function(currentTrainee){
			let status =CryptoJS.AES.decrypt(currentTrainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			console.log(status);
			let email = CryptoJS.AES.decrypt(currentTrainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
			if(status == 'Pending'){
				const token = crypto.randomBytes(20).toString('hex');
							currentTrainee.trainee_password_token = token;
							currentTrainee.trainee_password_expires = Date.now() + 3600000;
							currentTrainee.save().then(()=>
							console.log('token has been generated'),
							);
				// create mail transporter
			var transporter = nodeMailer.createTransport({
                    service: 'AOL',
                    auth: {
                        user: 'QABursary@aol.com',
                        pass: 'Passw0rd123'
                    }
                });
				//sending an email
			console.log("---------------------");
			console.log("Running Cron Job");
			var mailOptions = {
				from: 'QABursary@aol.com', // sender address
				to: email, // list of receivers
				subject: 'Activate QA Account', // Subject line
                text: 'Please navigate to the following link to activate your QA bursary account and set your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePassword/'+token // plain text body
			}            
			transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					console.log(error);
				}else{
					console.log("Email successfully sent!");
					winston.info('Cron job for trainees with Pending status have had emails sent');
				}
			});
			}
		})
	})
});
autoEmail.start();

// Send Trainee an email if they have not completed thier profile
const autoIncomplete = new CronJob('0 0 */12 * * *', function() {
	 pending = [];
	 Trainee.find(function(err, trainee) {
		trainee.map(function(currentTrainee){
			let status =CryptoJS.AES.decrypt(currentTrainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			console.log(status);
			let email = CryptoJS.AES.decrypt(currentTrainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
			if(status == 'Incomplete'){
				// create mail transporter
			var transporter = nodeMailer.createTransport({
                    service: 'AOL',
                    auth: {
                        user: 'QABursary@aol.com',
                        pass: 'Passw0rd123'
                    }
                });
				//sending an email
			console.log("---------------------");
			console.log("Running Cron Job");
			var mailOptions = {
				from: 'QABursary@aol.com', // sender address
				to: email, // list of receivers
				subject: 'Update Details', // Subject line
				text: 'Hi, When you have a moment can you login and fill in your bank details inorder for us to transfer your monthly bursary. Please Login at: http://'+process.env.REACT_APP_AWS_IP+':3000/login'// plain text body
			}            
			transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					console.log(error);
				}else{
					console.log("Email successfully sent!");
					winston.info('Cron job for trainees with Incomplete status have had emails sent');
				}
			});
			}
		})
	})
});
autoIncomplete.start();