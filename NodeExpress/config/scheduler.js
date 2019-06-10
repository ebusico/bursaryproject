const fs = require('node-fs');
const CronJob = require('cron').CronJob;
const nodeMailer = require('nodemailer');
const winston = require('./winston');

var databaseLogger = require('../config/winston-db')
var moment = require('moment');
var businessDiff = require('moment-business-days');
var HolidayFeed = require('uk-bank-holidays');
var async = require("async");

const crypto = require('crypto');
var CryptoJS = require("crypto-js");
let hex = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
let iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

let Trainee = require('../models/trainee.model');

//Will start after 1am on the first every month
const onceMonth = new CronJob('0 1 1 * *', function() {
	winston.info('Cron Job for Trainee working days for current month updated (automatic)');
	console.log("Cron Job has started");
    Trainee.find(function(err, trainee) {
      trainee.map(async function(trainee){
        if(!trainee){
            res.status(404).send("trainee is not found");
            logger.error("Trainee not found");
            winston.error("Trainee not found");
        }else{
			let feed = new HolidayFeed();
			await feed.load();
			let divisions = feed.divisions();
			let england = feed.divisions('england-and-wales')
        // calculate amount of days
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
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
                })
            }else if(bursary_start.isSame(bench_end, "month")){
				let bankHolidays = england.holidays(bursary_start,bench_end).length
                let workedDays = 1 + moment(bursary_start).businessDiff(bench_end) - bankHolidays;
                console.log("same start end month, days:" + workedDays);
                trainee.trainee_days_worked = workedDays;
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
                })
            }else if(currentMonth.isBefore(bursary_start, 'month')){
                console.log("Bursary starting in July, 0 days");
                trainee.trainee_days_worked = 0
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
                })
            }else if(currentMonth.isAfter(bench_end, 'month')){
                console.log("Bursary ending in April, 0 days");
                trainee.trainee_days_worked = 0
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
                })
            }else if(bursary_start.isSame(currentMonth, 'month')){
				let bankHolidays = england.holidays(bursary_start,currentMonth.endOf('month')).length
                let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").endOf('month');
                let workedDays = moment(start).businessDiff(end) - bankHolidays;
                console.log('current month is start date month, days worked: ' + workedDays);
				console.log(start);
				console.log(end);
                trainee.trainee_days_worked = workedDays;
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
                })
            }else if(bench_end.isSame(currentMonth, "month")){
				let bankHolidays = england.holidays(currentMonth.startOf('month'),bench_end).length
                let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").startOf('month');
                let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                let workedDays = 1 + moment(start).businessDiff(end) - bankHolidays;
                console.log('current month is end date month, days:' + workedDays);
                trainee.trainee_days_worked = workedDays;
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
                })
            }
            else{
				let start = moment().startOf('month');
				let end = moment().endOf('month');
				let bankHolidays = england.holidays(start,end).length
				console.log(start);
				console.log(end);
				let workedDays = moment(start).businessDiff(end) - bankHolidays;
                console.log("All days: "+workedDays);
				trainee.trainee_days_worked = workedDays;
					trainee.save().then(trainee => {
                    res.json('Days worked updated!');
					winston.info("Trainee working days for current month updated (automatic)");
                    logger.info("Trainee working days for current month updated (automatic)");
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
			let fname = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			let lname = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
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
                        user: process.env.SYSTEM_EMAIL,
						pass: process.env.SYSTEM_PASSWORD
                    }
                });
				//sending an email
			console.log("---------------------");
			console.log("Running Cron Job");
			var mailOptions = {
				from: process.env.SYSTEM_EMAIL, // sender address
				to: email, // list of receivers
				subject: 'Activate QA Account', // Subject line
                text: 'Hello'+ fname + ' ' + lname + '!\n It seems you have not activated your QA Bursary Acccount yet. !\n Please navigate to the following link to activate your QA bursary account and create your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePassword/'+token // plain text body
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

//clears expenses every month
const clearExpenses =  new CronJob('0 1 1 * *', function() {
	pending = [];
	Trainee.find(function(err, trainee) {
	   trainee.map(function(currentTrainee){
		   currentTrainee.monthly_expenses = []
		   currentTrainee.save()
	   })
   })
   console.log("cleared expenses")
});
clearExpenses.start()