var express = require('express');
var traineeRoutes = express.Router();

const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var requireAuth = passport.authenticate('jwt', {session: false});

let Trainee = require('../models/trainee.model');

require('dotenv').config()

//gets all trainees in database
traineeRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin','recruiter','finance'])).get(function(req, res) {
    Trainee.find(function(err, trainee) {
        if (err) {
            console.log(err);
        } else {
            res.json(trainee);
        }
    });
});

//get a single trainee by id
traineeRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Trainee.findById(id, function(err, trainee) {
         res.json(trainee);
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Trainee doesn't exist");
    });
}) 

//get a single trainee by email
traineeRoutes.route('/getByEmail').post(function(req,res) {
    Trainee.findOne({trainee_email: req.body.trainee_email}, function(err, trainee) {
        res.json(trainee);
    })
    .catch(err => {
        res.status(205).send("Trainee doesn't exist");
    })
})
//adds new trainee to database
traineeRoutes.route('/add').post(function(req, res) {
    let trainee = new Trainee(req.body);
    trainee.save()
        .then(trainee => {
            res.status(200).json({'trainee': 'Trainee added successfully'});
        })
        .catch(err => {
            res.status(205).send('Adding new trainee failed');
        });
});

//deletes a trainee by id
traineeRoutes.route('/delete/:id').get(function(req, res) {
    Trainee.remove({_id: req.params.id}, function(err, trainee) {
        if(!err){
            res.json({'result':true});
        }
        else{
            console.log(err);
            res.json({'result': false});
        }
});
});

//gets trainee by id and updates values of that trainee
traineeRoutes.route('/update/:id').post(function(req, res) {
    Trainee.findById(req.params.id, function(err, trainee) {
        if (!trainee)
            res.status(404).send("data is not found");
        else
            trainee.trainee_fname = req.body.trainee_fname;
            trainee.trainee_lname = req.body.trainee_lname;
            trainee.trainee_email = req.body.trainee_email;
			trainee.trainee_bank_name = req.body.trainee_bank_name;
            trainee.trainee_account_no = req.body.trainee_account_no;
            trainee.trainee_sort_code = req.body.trainee_sort_code;

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
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
            trainee.trainee_start_date = req.body.trainee_start_date;
            trainee.trainee_end_date = req.body.trainee_end_date;

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
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
        res.status(403).send('password reset link is invalid or has expired');
      } else {
        res.status(200).send({
          trainee_id: trainee._id,
          message: 'password reset link a-ok',
        });
      }
    });
  });

//sends trainee password reset email
traineeRoutes.route('/send-email').post(function(req, res) {
    var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
    var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
    var email = CryptoJS.AES.decrypt(req.body.trainee_email, key, {iv:iv});
    console.log("got email:" + email.toString(CryptoJS.enc.Utf8));
    Trainee.findOne({trainee_email: req.body.trainee_email}, function(err, trainee) {
        console.log(trainee)
        if (!trainee){
            res.status(404).send("Email is not found");
        }
        else{
            const token = crypto.randomBytes(20).toString('hex');
            trainee.trainee_password_token = token;
            trainee.trainee_password_expires = Date.now() + 3600000;
            trainee.save().then(()=>console.log('token generated'));
            var transporter = nodeMailer.createTransport({
                service: 'AOL',
                auth: {
                    user: 'QABursary@aol.com',
                    pass: 'Passw0rd123'
                }
            });
            var mailOptions = {
                from: 'QABursary@aol.com', // sender address
                to: email.toString(CryptoJS.enc.Utf8), // list of receivers
                subject: 'Password Reset', // Subject line
                text: 'Please navigate to the following link to activate your QA bursary account and set your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePassword/'+token // plain text body
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
        else
            //bcrypt pass
            //var bytes  = CryptoJS.AES.decrypt(req.body.trainee_password, '3FJSei8zPx');
            var decryptPass = CryptoJS.AES.decrypt(req.body.trainee_password, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(decryptPass, salt, function(err, hash) {
                  req.body.trainee_password = hash;
                  trainee.trainee_password = req.body.trainee_password;
                  trainee.save().then(trainee => {
                    res.json('Password updated!');
                })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
                });
              });
    });
});

module.exports = traineeRoutes;
