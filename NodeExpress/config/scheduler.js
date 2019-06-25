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
let User = require('../models/staff');

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
            }else if(bursary_start.isSame(currentMonth, 'month')&&bench_end.isSame(currentMonth, 'month')){ 
                let bankHolidays = 0; 
                if(bank === true){ 
                    bankHolidays = england.holidays(bursary_start,bench_end).length 
                    console.log(bankHolidays); 
                } 
                let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD");
                let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                let workedDays = moment(start).businessDiff(end) - bankHolidays; 
                console.log('current month is start date month, days worked: ' + workedDays); 
                console.log(start); 
                console.log(end); 
                trainee.trainee_days_worked = CryptoJS.AES.encrypt(workedDays.toString(), '3FJSei8zPx').toString(); 
                trainee.save().then(trainee => { 
                    res.json('Days worked updated!'); 
                    logger.info("Trainee working days for current month updated (automatic)") 
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
const autoEmail =  new CronJob('00 00 10,16 * * 1,2,3,4,5', function() {
     // create mail transporter
     var transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        pool: true,
        maxConnections: 5,
        maxMessages: 5,
        auth: {
            user: process.env.SYSTEM_EMAIL,
            pass: process.env.SYSTEM_PASSWORD,
        }
    });
	 Trainee.find(function(err, trainee) {
		trainee.map(function(currentTrainee){
			let status =CryptoJS.AES.decrypt(currentTrainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			let email = CryptoJS.AES.decrypt(currentTrainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
			let fname = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            let lname = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			if(status == 'Pending'){
				const token = crypto.randomBytes(20).toString('hex');
							currentTrainee.trainee_password_token = token;
							currentTrainee.trainee_password_expires = Date.now() + 1728000000;                            ;
							currentTrainee.save().then(()=>
							console.log('token has been generated'),
							);
                //sending an email
                console.log("---------------------");
                console.log("Running Cron Job");
                console.log(status);
                var mailOptions = {
                    from: process.env.SYSTEM_EMAIL, // sender address
                    to: email, // list of receivers
                    subject: 'Activate QA Account', // Subject line
                    text: 'Hello '+ fname + ' ' + lname + '!\n It seems you have not activated your QA Concourse Acccount yet. !\n Please navigate to the following link to activate your account and create your password: https://'+process.env.REACT_APP_AWS_IP+'/changePassword/'+token // plain text body
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
}, null, true, 'Europe/London');
autoEmail.start();

const autoEmailStaff =  new CronJob('00 30 10,16 * * 1,2,3,4,5', function() {
    // create mail transporter
    var transporter = nodeMailer.createTransport({
       host: 'smtp.gmail.com',
       port: 465,
       pool: true,
       maxConnections: 5,
       maxMessages: 5,
       auth: {
           user: process.env.SYSTEM_EMAIL,
           pass: process.env.SYSTEM_PASSWORD,
       }
   });
    User.find(function(err, users) {
       users.map(function(currentUser){
           let status =CryptoJS.AES.decrypt(currentUser.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
           let email = CryptoJS.AES.decrypt(currentUser.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
           let fname = CryptoJS.AES.decrypt(currentUser.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
           let lname = CryptoJS.AES.decrypt(currentUser.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
           if(status == 'Pending'){
               const token = crypto.randomBytes(20).toString('hex');
                           currentUser.password_token = token;
                           currentUser.password_expires = Date.now() + 1728000000;                            ;
                           currentUser.save().then(()=>
                           console.log('token has been generated'),
                           );
               //sending an email
               console.log("---------------------");
               console.log("Running Cron Job");
               console.log(status);
               var mailOptions = {
                   from: process.env.SYSTEM_EMAIL, // sender address
                   to: email, // list of receivers
                   subject: 'Activate QA Account', // Subject line
                   text: 'Hello '+ fname + ' ' + lname + '!\n It seems you have not activated your QA Concourse staff acccount yet. !\n Please navigate to the following link to activate your account and create your password: https://'+process.env.REACT_APP_AWS_IP+'/changePassword/'+token // plain text body
               }      
               transporter.sendMail(mailOptions, function(error, info) {
                   if (error) {
                       console.log(error);
                   }else{
                       console.log("Staff email successfully sent!");
                       winston.info('Cron job for staff with Pending status have had emails sent');
                   }
               });
           }
       })
   })
}, null, true, 'Europe/London');
autoEmailStaff.start();

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
}, null, true, 'Europe/London');
clearExpenses.start()