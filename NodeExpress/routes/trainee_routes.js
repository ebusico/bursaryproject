var express = require('express');
var traineeRoutes = express.Router();
var async = require("async");
var request = require('request');

var HolidayFeed = require('uk-bank-holidays');
const winston = require('../config/winston');
var databaseLogger = require('../config/winston-db')
var moment = require('moment');
var businessDiff = require('moment-business-days');

const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var requireAuth = passport.authenticate('jwt', {session: false});

let Trainee = require('../models/trainee.model');
let SortCodeCollection = require('../models/sortcode.model');


let monthlyReports = require('../models/monthlyReport.model');

require('dotenv').config()

let hex = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
let iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

//gets all trainees in database
traineeRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin','recruiter','finance'])).get(function(req, res) {
    Trainee.find(function(err, trainee) {
        let logger = databaseLogger.createLogger("universal");
        if (err) {
            console.log(err);
            winston.error(err);
            logger.error(err);
        } else {
            trainee.map(function(currentTrainee, i){
                var bytes  = CryptoJS.AES.decrypt(currentTrainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
                currentTrainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, '3FJSei8zPx');
                currentTrainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, '3FJSei8zPx');
                currentTrainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.status, '3FJSei8zPx');
                currentTrainee.status = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.added_By, '3FJSei8zPx');
                currentTrainee.added_By = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.bursary, '3FJSei8zPx');
                currentTrainee.bursary = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.bursary_amount, '3FJSei8zPx');
                currentTrainee.bursary_amount = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_start_date, '3FJSei8zPx');
                currentTrainee.trainee_start_date = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_end_date, '3FJSei8zPx');
                currentTrainee.trainee_end_date = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_days_worked, '3FJSei8zPx');
                currentTrainee.trainee_days_worked = bytes.toString(CryptoJS.enc.Utf8);
                currentTrainee.monthly_expenses.map(expense => {
                    //console.log(expense);
                    expense.expenseType = CryptoJS.AES.decrypt(expense.expenseType,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                    expense.amount = CryptoJS.AES.decrypt(expense.amount,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                   } )
                if(currentTrainee.status === 'Active'){
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_bank_name, '3FJSei8zPx');
                    currentTrainee.trainee_bank_name = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_account_no, '3FJSei8zPx');
                    currentTrainee.trainee_account_no = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_sort_code, '3FJSei8zPx');
                    currentTrainee.trainee_sort_code = bytes.toString(CryptoJS.enc.Utf8);
                }
            });
            console.log(trainee);
            res.json(trainee);
            logger.verbose('database collected all trainees successfully');
			winston.info('database collected all trainees successfully');
        }
    });
});

//get a single trainee by id
traineeRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    console.log(req.params);
    Trainee.findById(id, function(err, trainee) {
        console.log('trainee found is :');
        console.log(trainee);
        if(!trainee){
            res.json(null);
        }
        else{
            var bytes  = CryptoJS.AES.decrypt(trainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
            trainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_fname, '3FJSei8zPx');
            trainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_lname, '3FJSei8zPx');
            trainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.status, '3FJSei8zPx');
            trainee.status = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.added_By, '3FJSei8zPx');
            trainee.added_By = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.bursary, '3FJSei8zPx');
            trainee.bursary = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx');
            trainee.trainee_start_date = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_end_date, '3FJSei8zPx');
            trainee.trainee_end_date = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_bench_start_date, '3FJSei8zPx');
            trainee.trainee_bench_start_date = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx');
            trainee.trainee_bench_end_date = bytes.toString(CryptoJS.enc.Utf8);
			bytes = CryptoJS.AES.decrypt(trainee.bank_holiday, '3FJSei8zPx');
            trainee.bank_holiday = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.bursary_amount, '3FJSei8zPx');
            trainee.bursary_amount = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_days_worked, '3FJSei8zPx');
            trainee.trainee_days_worked = bytes.toString(CryptoJS.enc.Utf8);
            if(trainee.status === 'Active'){
                bytes = CryptoJS.AES.decrypt(trainee.trainee_bank_name, '3FJSei8zPx');
                trainee.trainee_bank_name = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_account_no, '3FJSei8zPx');
                trainee.trainee_account_no = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_sort_code, '3FJSei8zPx');
                trainee.trainee_sort_code = bytes.toString(CryptoJS.enc.Utf8);
            }
            let logger = databaseLogger.createLogger(trainee.trainee_email);
            res.json(trainee);
            logger.verbose("Trainee info accessed")
            winston.info('get data for trainee: '+ trainee.trainee_email);
        }
    })
    .catch(err => {
        console.log(err);
		winston.error(err)
        res.status(400).send("Trainee doesn't exist");
    });
}) 

//get a single trainee by email
traineeRoutes.route('/getByEmail').post(function(req,res) {
    let logger = databaseLogger.createLogger(req.body.trainee_email);
    let email = CryptoJS.AES.encrypt(req.body.trainee_email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString();
    Trainee.findOne({trainee_email: email}, function(err, trainee) {
        if(!trainee){
            res.status(205).send("Trainee doesn't exist");
            winston.error("Trainee: "+ req.body.trainee_email+ " doesn't exist");
            logger.error("Trainee: "+ req.body.trainee_email+ " doesn't exist");
        }
        else{
            var bytes  = CryptoJS.AES.decrypt(trainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
            trainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_fname, '3FJSei8zPx');
            trainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_lname, '3FJSei8zPx');
            trainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.status, '3FJSei8zPx');
            trainee.status = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.added_By, '3FJSei8zPx');
            trainee.added_By = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.bursary, '3FJSei8zPx');
            trainee.bursary = bytes.toString(CryptoJS.enc.Utf8);
            res.json(trainee);
            winston.info("Trainee: "+req.body.trainee_email+" info returned");
            logger.verbose("Trainee: "+req.body.trainee_email+" info returned");
        }
    })
    .catch(err => {
        res.status(205).send("Trainee doesn't exist");
        winston.error(err);
        logger.error(err);
    })
})


// update trainee days to work
traineeRoutes.route('/daysToWork/:id').post(function(req, res) {
	Trainee.findById(req.params.id, function(err, trainee) {
		if (!trainee)
            res.status(404).send("no data is not found");
        else{
			let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
			let days = CryptoJS.AES.encrypt(req.body.trainee_days_worked, '3FJSei8zPx').toString();
			trainee.trainee_days_worked = days;
            console.log(req.body.trainee_days_worked);
            console.log("encrypted"+days);
			
			trainee.save().then(trainee => {
                res.json('Trainee working days have been updated');
				winston.info('Trainee: '+ email+ ' has had their working days amount changed');
                logger.info('Trainee: '+ email+ ' has had their working days dates changed');
            })
            .catch(err => {
                res.status(400).send("Could not updated Days Worked");
                console.log(err);
				winston.error('Trainee: '+ email+ ' has not been updated due to error: '+err)
                logger.error('Trainee: '+ email+ ' has not been updated due to error: '+err);
            });
		}
  });
});
//find one trainee for days to work 
traineeRoutes.route('/daysToWork').post(function(req, res){
    let logger = databaseLogger.createLogger(req.body.trainee_email);
    let email = CryptoJS.AES.encrypt(req.body.trainee_email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString();
    Trainee.findOne({trainee_email: email}, async function(err, trainee) {
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
			let bank = trainee.bank_holiday;
            let bursary = CryptoJS.AES.encrypt(trainee.bursary, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            let bursary_start = moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8));
            let bench_end = moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8));
            console.log(trainee);
            console.log("encrypted start: "+ trainee.trainee_start_date);
            console.log("encrypted start: "+ trainee.trainee_bench_end_date);
			console.log("start: "+bursary_start);
            console.log("end: "+bench_end.format("MM"));
			console.log("pay for bank holidays: " + bank)
            if(bursary == "False"){
                trainee.trainee_days_worked = CryptoJS.AES.encrypt(0, '3FJSei8zPx').toString();;
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
                })
            }else if(currentMonth.isBefore(bursary_start, 'month')){
                console.log("Bursary starting in July, 0 days");
                trainee.trainee_days_worked = CryptoJS.AES.encrypt(0, '3FJSei8zPx').toString();
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
                })
            }else if(currentMonth.isAfter(bench_end, 'month')){
                console.log("Bursary ending in April, 0 days");
                trainee.trainee_days_worked = CryptoJS.AES.encrypt(0, '3FJSei8zPx').toString();
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)");
                })
            }else if(bursary_start.isSame(currentMonth, 'month')){
				let bankHolidays = 0;
                if(bank === true){
                    bankHolidays = england.holidays(bursary_start,currentMonth.endOf('month')).length
					console.log(bankHolidays);
                }
                let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").endOf('month');
                let workedDays = moment(start).businessDiff(end) - bankHolidays;
                console.log('current month is start date month, days worked: ' + workedDays);
				console.log(start);
				console.log(end);
                trainee.trainee_days_worked = CryptoJS.AES.encrypt(workedDays.toString(), '3FJSei8zPx').toString();
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
                })
            }else if(bench_end.isSame(currentMonth, "month")){
				let bankHolidays = 0;
                if(bank == true){
                     bankHolidays = england.holidays(currentMonth.startOf('month'),bench_end).length
                }
                let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").startOf('month');
                let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                let workedDays = 1 + moment(start).businessDiff(end) - bankHolidays;
                console.log('current month is end date month, days:' + workedDays);
                trainee.trainee_days_worked = CryptoJS.AES.encrypt(workedDays.toString(), '3FJSei8zPx').toString();
                trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
                })
            }
            else{
                let bankHolidays = 0;
                let start = moment().startOf('month');
				let end = moment().endOf('month');
                if(bank == true){
                    bankHolidays = england.holidays(start,end).length
                }
				console.log(start);
				console.log(end);
				let workedDays = moment(start).businessDiff(end) - bankHolidays;
                console.log("All days: "+workedDays);
				trainee.trainee_days_worked = CryptoJS.AES.encrypt(workedDays.toString(), '3FJSei8zPx').toString();
					trainee.save().then(trainee => {
                    res.json('Days worked updated!');
                    logger.info("Trainee working days for current month updated (automatic)")
                })
            }
    }
 });
});

//adds new trainee to database
traineeRoutes.route('/add').post(function(req, res) {
    let email = req.body.trainee_email;
    let addedBy = req.body.added_By;
    let logger = databaseLogger.createLogger(email);
    console.log("adding a trainee req.body : ");
    console.log(req.body);
	
    req.body.trainee_fname = CryptoJS.AES.encrypt(req.body.trainee_fname, '3FJSei8zPx').toString();
    req.body.trainee_lname = CryptoJS.AES.encrypt(req.body.trainee_lname, '3FJSei8zPx').toString();
    req.body.trainee_email = CryptoJS.AES.encrypt(req.body.trainee_email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
    req.body.trainee_password  = CryptoJS.AES.encrypt(req.body.trainee_password, '3FJSei8zPx').toString();
    req.body.trainee_start_date = CryptoJS.AES.encrypt(req.body.trainee_start_date, '3FJSei8zPx').toString();
    req.body.trainee_end_date = CryptoJS.AES.encrypt(req.body.trainee_end_date, '3FJSei8zPx').toString();
    req.body.trainee_bench_start_date = CryptoJS.AES.encrypt(req.body.trainee_bench_start_date.toString(), '3FJSei8zPx').toString();
	req.body.trainee_bench_end_date = CryptoJS.AES.encrypt(req.body.trainee_bench_end_date.toString(), '3FJSei8zPx').toString();
	req.body.added_By = CryptoJS.AES.encrypt(req.body.added_By, '3FJSei8zPx').toString();
    req.body.status = CryptoJS.AES.encrypt('Pending', '3FJSei8zPx').toString();
    req.body.bursary = CryptoJS.AES.encrypt(req.body.bursary, '3FJSei8zPx').toString();
	req.body.bursary_amount = CryptoJS.AES.encrypt(req.body.bursary_amount, '3FJSei8zPx').toString();

	
    let trainee = new Trainee(req.body);
    trainee.save()
        .then(trainee => {
			console.log('Recruitor: ' + trainee.added_By + ' has created a new trainee: '+ trainee._id);
            console.log('An email is being sent to ' + trainee._id );
            logger.info('User: ' + addedBy + ' has created a new trainee: '+ email);
            logger.verbose('An email is being sent to ' + email);
			winston.info('User: ' + addedBy + ' has created a new trainee: '+ email);
			winston.info('An email is being sent to ' + email);
            res.status(200).json({'trainee': 'Trainee added successfully'});
			
        })
        .catch(err => {
            res.status(205).send('Adding new trainee failed');
			console.log(err);
            winston.error('Adding new trainee failed. Error: '+err);
            logger.error('Adding new trainee failed. Error: '+err);
        });
});

//deletes a trainee by id
traineeRoutes.route('/delete/:id').get(function(req, res) {
    Trainee.findById(req.params.id, function(err, trainee) {
        if(!trainee){
            res.status(404).send("trainee is not found");
        }
        else{
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                                            , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                                            , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                                            .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            trainee.status = CryptoJS.AES.encrypt('Suspended', '3FJSei8zPx').toString();
            trainee.save().then(trainee => {
                res.json('Trainee deleted');
                winston.info('Trainee: '+email+ ' has been suspended')
                logger.info('Trainee: '+email+ ' has been suspended')
            })
            .catch(err => {
                res.status(400).send("Delete not possible");
                winston.error('Trainee:'+email+' could not be suspended. Error: ' + err)
                logger.error('Trainee:'+email+' could not be suspended. Error: ' + err)
            });
        }
    });       
});

//reactivates a deleted a trainee by id
traineeRoutes.route('/reactivate/:id').get(function(req,res){
    Trainee.findById(req.params.id, function(err, trainee) {
        if(!trainee ){
            res.status(404).send("trainee is not found");
        }
        else{
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            if(trainee.trainee_bank_name != null){
                trainee.status = CryptoJS.AES.encrypt('Active', '3FJSei8zPx').toString();
            }
            else{
                trainee.status = CryptoJS.AES.encrypt('Incomplete', '3FJSei8zPx').toString();                  
            }
            trainee.save().then(trainee => {
                res.json('Trainee reactivated');
                winston.info('Trainee: '+email+ ' has been reactivated');
                logger.info('Trainee: '+email+ ' has been reactivated');
            })
            .catch(err => {
                res.status(400).send("Reactivation not possible");
                 winston.error('Trainee:'+trainee._id+' could not be reactivated. Error: ' + err);
                 logger.error('Trainee:'+trainee._id+' could not be reactivated. Error: ' + err);
            });
        }

    })
})

//gets trainee by id and updates values of that trainee
traineeRoutes.route('/update/:id').post(function(req, res) {
    Trainee.findById(req.params.id, function(err, trainee) {
        if (!trainee)
            res.status(404).send("data is not found");
        else{
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            var status = CryptoJS.AES.decrypt(trainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            if(status === 'Incomplete'){
                trainee.status = CryptoJS.AES.encrypt('Active', '3FJSei8zPx');
            }
            trainee.trainee_email = CryptoJS.AES.encrypt(req.body.trainee_email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
            trainee.trainee_fname = CryptoJS.AES.encrypt(req.body.trainee_fname, '3FJSei8zPx').toString();
            trainee.trainee_lname = CryptoJS.AES.encrypt(req.body.trainee_lname, '3FJSei8zPx').toString();
            trainee.trainee_bank_name = CryptoJS.AES.encrypt(req.body.trainee_bank_name, '3FJSei8zPx').toString();
            trainee.trainee_account_no = CryptoJS.AES.encrypt(req.body.trainee_account_no, '3FJSei8zPx').toString();
            trainee.trainee_sort_code = CryptoJS.AES.encrypt(req.body.trainee_sort_code, '3FJSei8zPx').toString();

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
                winston.info('Trainee: '+email+' has updated their bank details');
				logger.info('Trainee: '+email+' has updated their bank details');                
				})
            .catch(err => {
                res.status(400).send("Update not possible");
                winston.error('Trainee: '+email+' tried to update there details but got error: ' + err)
                logger.error('Trainee: '+email+' tried to update there details but got error: ' + err)
            });
        }    
    });
});

//gets trainee by id and updates start/end date
traineeRoutes.route('/editDates/:id').post(function(req, res) {
    console.log(req);
    Trainee.findById(req.params.id, function(err, trainee) {
        if (!trainee){
            res.status(404).send("data is not found");
        }
        else {
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            trainee.trainee_start_date = CryptoJS.AES.encrypt(req.body.trainee_start_date, '3FJSei8zPx').toString();
            trainee.trainee_end_date = CryptoJS.AES.encrypt(req.body.trainee_end_date, '3FJSei8zPx').toString();
			trainee.trainee_bench_start_date = CryptoJS.AES.encrypt(req.body.trainee_bench_start_date, '3FJSei8zPx').toString();
			trainee.trainee_bench_end_date = CryptoJS.AES.encrypt(req.body.trainee_bench_end_date, '3FJSei8zPx').toString();
			
            trainee.save().then(trainee => {
                res.json('Trainee updated!');
                winston.info('Trainee: '+ email+ ' has had their starting/ending dates changed');
                logger.info('Trainee: '+ email+ ' has had their starting/ending dates changed');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
                winston.error('Trainee: '+ email+ ' has not been updated due to error: '+err)
                logger.error('Trainee: '+ email+ ' has not been updated due to error: '+err);
            });
        }
    });
});

//gets trainee by id and updates bursary status and bursary amount
traineeRoutes.route('/editBursary/:id').post(function(req, res){
    console.log(req);
    Trainee.findById(req.params.id, function(err, trainee){
        if(!trainee){
            res.status(404).send("data is not found");
        }
        else{
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            trainee.bursary =  CryptoJS.AES.encrypt(req.body.trainee_bursary, '3FJSei8zPx').toString();
            trainee.bursary_amount = CryptoJS.AES.encrypt(req.body.trainee_bursary_amount.toString(), '3FJSei8zPx').toString();

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
                winston.info('Trainee: '+ email+ ' has had their bursary status and amount changed');
                logger.info('Trainee: '+ email+ 'has had their bursary status and amount changed');
            }).catch(err =>{
                res.status(400).send("Update not possible");
                winston.error('Trainee: '+ email+ ' has not been updated due to error: '+err)
                logger.error('Trainee: '+ email+ ' has not been updated due to error: '+err);
            });
        }
    })
});

//checks if trainee password reset token is valid
traineeRoutes.route('/reset/:token').get(function(req, res) {
    Trainee.findOne({trainee_password_token: req.params.token, trainee_password_expires: {$gt: Date.now()}}).then((trainee) => {
      console.log(Date.now())
      if (trainee == null) {
        console.error('password reset link is invalid or has expired');
		winston.error('password reset link was invalid for the trainee')
        res.status(403).send('password reset link is invalid or has expired');
      } else {
		  winston.info(trainee._id + ' recevied reset link at status 200')
        res.status(200).send({
          trainee_id: trainee._id,
          message: 'password reset link a-ok',
        });
      }
    });
  });

traineeRoutes.route('/removeToken/:token').get(function(req, res) {
    Trainee.findOne({trainee_password_token: req.params.token}).then((trainee) => {
      console.log(Date.now())
      if (!trainee) {
        console.error('No token found');
		winston.error('No token found')
        res.status(403).send('No token found');
      } 
      else {
        trainee.trainee_password_expires = Date.now();
        trainee.save().then(()=>
          {res.status(200).send("Token destroyed")}
        )      
     }
    });
  });  

//sends trainee password reset email
traineeRoutes.route('/send-email').post(function(req, res) {
    console.log("got email:" + req.body.trainee_email);
    let logger = databaseLogger.createLogger(req.body.trainee_email)
    let email = CryptoJS.AES.encrypt(req.body.trainee_email, hex, {iv: iv}).toString();
    Trainee.findOne({trainee_email: email}, function(err, trainee) {
        console.log(trainee);
        if (!trainee){
            res.status(404).send("Email is not found");
        }
        else{
            const token = crypto.randomBytes(20).toString('hex');
            trainee.trainee_password_token = token;
            trainee.trainee_password_expires = Date.now() + 86400000;
            trainee.save().then(()=>
			console.log('email token has been generated'),
            winston.info('Email has been sent to ' + req.body.trainee_email),
            logger.verbose('Email has been sent to ' + req.body.trainee_email)
            );
            let fname = CryptoJS.AES.decrypt(trainee.trainee_fname, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            var transporter = nodeMailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.SYSTEM_EMAIL,
                    pass: process.env.SYSTEM_PASSWORD
                }
            });
            var mailOptions = {
                from: process.env.SYSTEM_EMAIL, // sender address
                to: req.body.trainee_email, // list of receivers
                subject: 'Password Reset', // Subject line
                text: 'Hello '+ fname +'!\n Welcome to the QA team!\nPlease click the link below to activate your QA concourse account and create your password:\nhttp://'+process.env.REACT_APP_AWS_IP+':3000/changePassword/'+token // plain text body
            }            

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.status(200).json({'email': 'Email Sent'});
            });
        }
    });
});

//updates trainee password
traineeRoutes.route('/update-password/:token').post(function(req, res) {
    Trainee.findOne({trainee_password_token: req.params.token}, function(err, trainee) {
        if (!trainee)
            res.status(404).send("data is not found");
        else{
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            //update status if Pending
            if(CryptoJS.AES.decrypt(trainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8) === 'Pending'){
                trainee.status = CryptoJS.AES.encrypt('Incomplete', '3FJSei8zPx').toString();
            } 
            //bcrypt pass
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.trainee_password, salt, function(err, hash) {
                  req.body.trainee_password = hash;
                  trainee.trainee_password = req.body.trainee_password;
                  trainee.save().then(trainee => {
                    res.json('Password updated!');
                    logger.info(email + ' has updated their password')
					winston.info(email + 'has updated thier password');
                })
                .catch(err => {
                    res.status(400).send("Update not possible");
                    winston.error('Trainee: '+email+' could not update their password. Error: ' + err);
                    logger.error('Trainee: '+email+' could not update their password. Error: ' + err);
                });
                });
            });
        }     
    });
});

traineeRoutes.route('/findBank').post(function(req,res) {
    sortcode = req.body.sort_code;
    SortCodeCollection.findOne({SortCode: sortcode}, function(err, bank) {
        if(bank === null){
            similar_sortcodes = [];
            async.each([0,1,2,3,4,5,6,7,8,9], function(i, callback) {
                sortcode = sortcode.slice(0, -1) + i;
                SortCodeCollection.findOne({SortCode: sortcode}, function(err, bank) {
                    if(bank != null){
                        if(bank.SortCode.length > 5){
                            similar_sortcodes.push(bank.SortCode);
                        }
                        else{
                            formatted_code= "0" + bank.SortCode;
                            similar_sortcodes.push(formatted_code);
                        }
                    }
                    callback(err);
                })
              }, function(err) {
                console.log(similar_sortcodes);
                if(similar_sortcodes.length === 0){
                    similar_sortcodes.push("No similar sort codes found")
                }
                res.json({Match: false, OtherCodes: similar_sortcodes});
              });
        }
        else{
            res.json({Match: true, BankName: bank.BankName, Branch: bank.Branch});
        }
    })
    .catch(err => {
        res.status(400).send("Error: " + err);
    })
})

//adds new Bank/Sortcode to database
traineeRoutes.route('/addBank').post(function(req, res) {
    let bank = new SortCodeCollection(req.body);
    bank.save()
        .then(trainee => {
            res.status(200).json({'bank': 'Sortcode added successfully'});
        })
        .catch(err => {
            res.status(205).send('Adding new Sortcode failed');
        });
});


//update or create new Monthly Report
traineeRoutes.route('/monthlyReport').post(function(req, res) {
    monthlyReports.findOne({month: req.body.month}, function(err, report) {
        Trainee.find(function(err, trainee){
            let reportTrainees=[]
                let promises = trainee.map(async function(trainee, i){
                if(req.body.month === moment().format("MMMM YYYY")){
                    if(CryptoJS.AES.decrypt(trainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)!=="Suspended" 
                    && CryptoJS.AES.decrypt(trainee.bursary, '3FJSei8zPx').toString(CryptoJS.enc.Utf8) === "True"
                    && CryptoJS.AES.decrypt(trainee.trainee_days_worked, '3FJSei8zPx').toString(CryptoJS.enc.Utf8) !== ''){
                        await reportTrainees.push(trainee);
                    }
                }
                else if(moment(req.body.month, 'MMMM YYYY').isSameOrAfter(moment())){
                    let feed = new HolidayFeed();
                    await feed.load();
                    let divisions = feed.divisions();
                    let england = feed.divisions('england-and-wales')
                    let currentMonth = moment(req.body.month, "MMMM YYYY");
                    let bank = trainee.bank_holiday;
                    let bursary = CryptoJS.AES.encrypt(trainee.bursary, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                    let bursary_start = moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8));
                    console.log("BURSARY START"+moment(bursary_start).format("DD/MM/YYYY"));
                    let bench_end = moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8));
                    if(bursary == "False"){

                    }else if(currentMonth.isBefore(bursary_start, 'month')){

                    }else if(currentMonth.isAfter(bench_end, 'month')){

                    }else if(bursary_start.isSame(currentMonth, 'month')){
                        let bankHolidays = 0;
                        if(bank === true){
                            bankHolidays = england.holidays(bursary_start,currentMonth.endOf('month')).length
                        }
                        let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                        let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").endOf('month');
                        let workedDays = moment(start).businessDiff(end) - bankHolidays;
                        console.log('current month is start date month, days worked: ' + workedDays);
                        trainee.trainee_days_worked = CryptoJS.AES.encrypt(workedDays.toString(), '3FJSei8zPx').toString();
                        await reportTrainees.push(trainee);
                    }
                    else if(bench_end.isSame(currentMonth, "month")){
                        let bankHolidays = 0;
                        if(bank == true){
                             bankHolidays = england.holidays(currentMonth.startOf('month'),bench_end).length
                        }
                        let start = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD").startOf('month');
                        let end = moment(moment(CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)).toDate(), "YYYY-MM-DD"); 
                        let workedDays = 1 + moment(start).businessDiff(end) - bankHolidays;
                        console.log('current month is end date month, days:' + workedDays);
                        trainee.trainee_days_worked = CryptoJS.AES.encrypt(workedDays.toString(), '3FJSei8zPx').toString();
                        await reportTrainees.push(trainee);
                    }
                    else{
                        let bankHolidays = 0;
                        let start = moment(currentMonth,'MMMM YYYY').startOf('month');
                        let end = moment(currentMonth,'MMMM YYYY').endOf('month');
                        if(bank == true){
                            bankHolidays = england.holidays(start,end).length
                        }
                        let workedDays = moment(start).businessDiff(end) - bankHolidays;
                        console.log("All days: "+workedDays);
                        trainee.trainee_days_worked = CryptoJS.AES.encrypt(workedDays.toString(), '3FJSei8zPx').toString();
                        await reportTrainees.push(trainee);
                    }
                    console.log("INSIDE AWAIT: "+reportTrainees.length) 
                    return reportTrainees; 
                }
            })
            Promise.all(promises).then(function () {
                console.log("PROMISES"+reportTrainees.length);
                //do something with the finalized list of albums here
                if(!report){
                    if(moment(req.body.month, 'MMMM YYYY').isSameOrAfter(moment(), 'month')){
                        let report = new monthlyReports()
                        report.month = req.body.month;
                        report.reportTrainees = reportTrainees;
                        report.status = CryptoJS.AES.encrypt("PendingApproval", '3FJSei8zPx').toString();
                        report.save().then(report =>{
                            res.json('Success');
                        });
                    }
                    else{
                        res.json('Report cannot be created');
                    }
                }
                else{
                    if(CryptoJS.AES.decrypt(report.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8) !== "FinanceApproved"){
                        report.reportTrainees = reportTrainees;
                        report.save().then(report => {
                            res.json('Successfully Updated');
                        })
                    }
                    else{
                        res.json('Report cannot be updated');
                    }
                }
            });

        })
    })
});

//get a specific monthly report
traineeRoutes.route('/getMonthlyReport').post(function(req, res) {
    monthlyReports.findOne({month: req.body.month}, function(err, report){
        console.log('here');
        console.log(report);
        if(!report){
            // returns report is not ready yet
            res.json('no report');
        } else{
            // report.totalDays = CryptoJS.AES.decrypt(report.totalDays, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            // report.totalDailyPayments = CryptoJS.AES.decrypt(report.totalDailyPayments, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            // report.totalAmount = CryptoJS.AES.decrypt(report.totalAmount, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            report.status = CryptoJS.AES.decrypt(report.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            report.reportTrainees.map(trainee =>{
                var bytes  = CryptoJS.AES.decrypt(trainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
                trainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_fname, '3FJSei8zPx');
                trainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_lname, '3FJSei8zPx');
                trainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.status, '3FJSei8zPx');
                trainee.status = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.added_By, '3FJSei8zPx');
                trainee.added_By = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.bursary, '3FJSei8zPx');
                trainee.bursary = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.bursary_amount, '3FJSei8zPx');
                trainee.bursary_amount = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx');
                trainee.trainee_start_date = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_end_date, '3FJSei8zPx');
                trainee.trainee_end_date = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_bench_start_date, '3FJSei8zPx');
                trainee.trainee_bench_start_date = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx');
                trainee.trainee_bench_end_date = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_days_worked, '3FJSei8zPx');
                trainee.trainee_days_worked = bytes.toString(CryptoJS.enc.Utf8);
                trainee.monthly_expenses.map(expense => {
                    //console.log(expense);
                    expense.expenseType = CryptoJS.AES.decrypt(expense.expenseType,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                    expense.amount = CryptoJS.AES.decrypt(expense.amount,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                   } )
                if(trainee.status === 'Active'){
                    bytes = CryptoJS.AES.decrypt(trainee.trainee_bank_name, '3FJSei8zPx');
                    trainee.trainee_bank_name = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(trainee.trainee_account_no, '3FJSei8zPx');
                    trainee.trainee_account_no = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(trainee.trainee_sort_code, '3FJSei8zPx');
                    trainee.trainee_sort_code = bytes.toString(CryptoJS.enc.Utf8);
                }
            })

            res.json(report);
        }
    })
})

//update report status
traineeRoutes.route('/monthlyReport/updateStatus').post(function(req, res) {
    monthlyReports.findOne({month: req.body.month}, function(err, report){
        if(!report){
            res.json('Unable to find a monthly report');
        }
        else{
            if(req.body.user_role === "admin"){
                report.status = CryptoJS.AES.encrypt('AdminApproved', '3FJSei8zPx').toString();
                report.save().then(report => {
                    res.json('Sucessfully updated ');
                })
            }
            else if(req.body.user_role === "finance"){
                report.status = CryptoJS.AES.encrypt('FinanceApproved', '3FJSei8zPx').toString();
                report.save().then(report => {
                    res.json('Sucessfully updated ');
                })
            }
            else{
                res.json('Unable to update report');
            }
        }
    })
})

module.exports = traineeRoutes;
