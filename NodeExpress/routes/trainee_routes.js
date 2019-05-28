var express = require('express');
var traineeRoutes = express.Router();
var async = require("async");

const winston = require('../config/winston');

const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var requireAuth = passport.authenticate('jwt', {session: false});

let Trainee = require('../models/trainee.model');
let SortCodeCollection = require('../models/sortcode.model');

require('dotenv').config()

let hex = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
let iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

//gets all trainees in database
traineeRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin','recruiter','finance'])).get(function(req, res) {
    Trainee.find(function(err, trainee) {
        if (err) {
            console.log(err);
			winston.error(err);
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
                bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_start_date, '3FJSei8zPx');
                currentTrainee.trainee_start_date = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_end_date, '3FJSei8zPx');
                currentTrainee.trainee_end_date = bytes.toString(CryptoJS.enc.Utf8);
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
			winston.info('database collected all trainees successfully')
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
        if(trainee === null){
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
            if(trainee.status === 'Active'){
                bytes = CryptoJS.AES.decrypt(trainee.trainee_bank_name, '3FJSei8zPx');
                trainee.trainee_bank_name = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_account_no, '3FJSei8zPx');
                trainee.trainee_account_no = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_sort_code, '3FJSei8zPx');
                trainee.trainee_sort_code = bytes.toString(CryptoJS.enc.Utf8);
            }
            res.json(trainee);
            winston.info('get data for trainee: '+ id);
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
    let email = CryptoJS.AES.encrypt(req.body.trainee_email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
    Trainee.findOne({trainee_email: email}, function(err, trainee) {
        var bytes  = CryptoJS.AES.decrypt(currentTrainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
        trainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
        bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, '3FJSei8zPx');
        trainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
        bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, '3FJSei8zPx');
        trainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
        bytes = CryptoJS.AES.decrypt(currentTrainee.status, '3FJSei8zPx');
        trainee.status = bytes.toString(CryptoJS.enc.Utf8);
        bytes = CryptoJS.AES.decrypt(currentTrainee.added_By, '3FJSei8zPx');
        trainee.added_By = bytes.toString(CryptoJS.enc.Utf8);
        bytes = CryptoJS.AES.decrypt(currentTrainee.bursary, '3FJSei8zPx');
        trainee.bursary = bytes.toString(CryptoJS.enc.Utf8);
        res.json(trainee);
		winston.info('found email: ' + trainee);
    })
    .catch(err => {
        res.status(205).send("Trainee doesn't exist");
		winston.error(err);
    })
})
//adds new trainee to database
traineeRoutes.route('/add').post(function(req, res) {
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
    req.body.status = CryptoJS.AES.encrypt('Incomplete', '3FJSei8zPx').toString();
    req.body.bursary = CryptoJS.AES.encrypt(req.body.bursary, '3FJSei8zPx').toString();
    let trainee = new Trainee(req.body);
    trainee.save()
        .then(trainee => {
			console.log('Recruitor: ' + trainee.added_By + ' has created a new trainee: '+ trainee._id);
			console.log('An email is being sent to ' + trainee._id );
			winston.info('Recruitor: ' + trainee.added_By + ' has created a new trainee: '+ trainee._id);
			winston.info('An email is being sent to ' + trainee._id );
            res.status(200).json({'trainee': 'Trainee added successfully'});
			
        })
        .catch(err => {
            res.status(205).send('Adding new trainee failed');
			console.log(err);
			winston.error(err);
        });
});

//deletes a trainee by id
traineeRoutes.route('/delete/:id').get(function(req, res) {
    Trainee.findById(req.params.id, function(err, trainee) {
        if(!trainee){
            res.status(404).send("trainee is not found");
        }
        else{
                trainee.status = CryptoJS.AES.encrypt('Suspended', '3FJSei8zPx').toString();
                trainee.save().then(trainee => {
                    res.json('Trainee deleted');
                    winston.info(trainee._id + ' has been suspended')
                    })
                .catch(err => {
                    res.status(400).send("Delete not possible");
                    winston.error('Trainee:'+trainee._id+' could not be suspended. Error: ' + err)
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
            if(trainee.trainee_bank_name != null){
                trainee.status = CryptoJS.AES.encrypt('Active', '3FJSei8zPx').toString();
            }
            else{
                trainee.status = CryptoJS.AES.encrypt('Incomplete', '3FJSei8zPx').toString();                  
            }
            trainee.save().then(trainee => {
                res.json('Trainee reactivated');
                winston.info(trainee._id + ' has been reactivated')
            })
            .catch(err => {
                res.status(400).send("Reactivation not possible");
                 winston.error('Trainee:'+trainee._id+' could not be reactivated. Error: ' + err)
            });
        }

    })
})

//gets trainee by id and updates values of that trainee
traineeRoutes.route('/update/:id').post(function(req, res) {
    Trainee.findById(req.params.id, function(err, trainee) {
        if (!trainee)
            res.status(404).send("data is not found");
        else
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
				winston.info(trainee._id + 'has made changes to there details')
				})
            .catch(err => {
                res.status(400).send("Update not possible");
				winston.error('Trainee tried to update there details but got ' + err)
            });
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
            trainee.trainee_start_date = CryptoJS.AES.encrypt(req.body.trainee_start_date, '3FJSei8zPx').toString();
            trainee.trainee_end_date = CryptoJS.AES.encrypt(req.body.trainee_end_date, '3FJSei8zPx').toString();

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
				winston.info('trainee: '+ trainee._id + 'has had there start & end dates changed');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
				winston.error(err)
            });
        }
    });
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

//sends trainee password reset email
traineeRoutes.route('/send-email').post(function(req, res) {
    console.log("got email:" + req.body.trainee_email);
    winston.info('an email will be sent to the trainee:');
    let email = CryptoJS.AES.encrypt(req.body.trainee_email, hex, {iv: iv}).toString();
    console.log(email);
    
    Trainee.findOne({trainee_email: email}, function(err, trainee) {
        console.log(trainee);
		winston.info(trainee);
        if (!trainee){
            res.status(404).send("Email is not found");
        }
        else{
            const token = crypto.randomBytes(20).toString('hex');
            trainee.trainee_password_token = token;
            trainee.trainee_password_expires = Date.now() + 3600000;
            trainee.save().then(()=>
			console.log('email token has been generated'),
			winston.info('Email has been sent to ' + trainee._id)
			);
            var transporter = nodeMailer.createTransport({
                service: 'AOL',
                auth: {
                    user: 'QABursary@aol.com',
                    pass: 'Passw0rd123'
                }
            });
            var mailOptions = {
                from: 'QABursary@aol.com', // sender address
                to: req.body.trainee_email, // list of receivers
                subject: 'Password Reset', // Subject line
                text: 'Please navigate to the following link to activate your QA bursary account and set your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePassword/'+token // plain text body
            }            

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
				winston.info('Message %s sent: %s', info.messageId, info.response);
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
        else
            //bcrypt pass
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.trainee_password, salt, function(err, hash) {
                  req.body.trainee_password = hash;
                  trainee.trainee_password = req.body.trainee_password;
                  trainee.save().then(trainee => {
                    res.json('Password updated!');
					winston.info(trainee._id + 'has updated thier password');
                })
                .catch(err => {
                    res.status(400).send("Update not possible");
					winston.error('trainee could not update thier password' + err);
                });
                });
              });
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


module.exports = traineeRoutes;
