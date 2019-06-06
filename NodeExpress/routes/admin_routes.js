var express = require('express');
var adminRoutes = express.Router();

const fs = require('fs');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const winston = require('../config/winston');
const databaseLogger = require('../config/winston-db')

var jwt = require('jsonwebtoken');
var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var secret = require('../config/auth.js');
var requireAuth = passport.authenticate('jwt', {session: false});

let User = require('../models/staff');
let Records = require('../models/record.model');
let Trainee = require('../models/trainee.model');

//gets all users
adminRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin'])).get(function(req, res) {
    User.find(function(err, staff) {
        let logger = databaseLogger.createLogger("universal")
        if (err) {
           console.log(err);
		   winston.error(err);
        } else {
            //
            staff.map(function(currentStaff, i){
                currentStaff.email = CryptoJS.AES.decrypt(currentStaff.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
                currentStaff.fname = CryptoJS.AES.decrypt(currentStaff.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
                currentStaff.lname = CryptoJS.AES.decrypt(currentStaff.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
                currentStaff.status = CryptoJS.AES.decrypt(currentStaff.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            });
            res.json(staff);
			logger.verbose('All staff users were collected successfully');            
			winston.info('All staff users were collected successfully');
        }
    });
});

// Get logs 
adminRoutes.route('/getServerLogs').get(function(req, res){
	fs.readFile('./logs/server_logs.log', 'utf8', function(err,data) {
		if(err){
			res.send(err);
		}else{
		let splitted = data.toString().split("\\r");
			res.send(splitted);
		}
		});
	});

//gets single user by id
adminRoutes.route('/staff/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, staff) {
        console.log('STAFF TRYING TO FIND :');
        console.log(staff);
        if(!staff){
            res.json(null);
        }
        else{
		    staff.fname = CryptoJS.AES.decrypt(staff.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
		    staff.lname = CryptoJS.AES.decrypt(staff.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
		    staff.email = CryptoJS.AES.decrypt(staff.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
            staff.status = CryptoJS.AES.decrypt(staff.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            res.json(staff);
            let logger = databaseLogger.createLogger(staff.email);
            winston.info('Returned Staff details: ' + staff.email);
            logger.verbose('Returned Staff details: ' + staff.email);
        }
    })
    .catch(err => {
        res.status(400).send("Staff doesn't exist");
		console.log('staff doesnt exist');
        winston.error('tried to get staff member but does not exist ' + err)
    });
});

//gets single user by email
adminRoutes.route('/getByEmail').post(function(req,res) {
    let logger = databaseLogger.createLogger(req.body.staff_email)
    let staff_email = CryptoJS.AES.encrypt(req.body.staff_email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString();
    User.findOne({email: staff_email}, function(err, user) {
        if(!user){
            res.status(205).send("User doesn't exist");
            winston.error("User: "+ req.body.staff_email+ " doesn't exist");
            logger.error("User: "+ req.body.staff_email+ " doesn't exist");
        }
        else{
            var bytes  = CryptoJS.AES.decrypt(user.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
            user.email = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(user.fname, '3FJSei8zPx');
            user.fname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(user.lname, '3FJSei8zPx');
            user.lname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(user.status, '3FJSei8zPx');
            user.status = bytes.toString(CryptoJS.enc.Utf8);
            res.json(user);
            winston.info("User: "+req.body.staff_email+" info returned");
            logger.verbose("User: "+req.body.staff_email+" info returned");
        }
    })
    .catch(err => {
        res.status(205).send("User doesn't exist");
        winston.error(err);
        logger.error(err);
    })
})

//adds new user to database
adminRoutes.route('/addUser', requireAuth).post(function(req,res){
    let logger = databaseLogger.createLogger(req.body.email);
    //encrypt before adding
    var newUser = new User({
      email: CryptoJS.AES.encrypt(req.body.email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(),
      password: CryptoJS.AES.encrypt(req.body.password, 'c9nMaacr2Y'),
      fname: CryptoJS.AES.encrypt(req.body.fname, 'c9nMaacr2Y').toString(),
      lname: CryptoJS.AES.encrypt(req.body.lname, 'c9nMaacr2Y').toString(),
      role: req.body.role,
      status: CryptoJS.AES.encrypt(req.body.status, '3FJSei8zPx').toString()
    });
    User.createUser(newUser, function(err, user){
      if(err){
          console.log(err);
          console.log('duplicate email');
          res.status(205).send();
      }
      else{
        const token = jwt.sign(user._id.toJSON(), secret.secret); //user need to be JSONed or causes an error
        logger.info(user.role +' ' + req.body.email+ ' created.');
        winston.info(user.role +' ' + req.body.email+ ' created.');
		console.log(' created '+ user.role + ' ' + req.body.email );
        return res.json({result: true, role: user.role, token});
      }
    });
});


//Should be deleted. Not neccessary anymore.
//adds user with encryption(used to add users directly from postman)
adminRoutes.route('/addUser/postman').post(function(req,res){
    CryptoJS.pad.NoPadding = {pad: function(){}, unpad: function(){}};
    var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
    var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
    
    var encrypted = CryptoJS.AES.encrypt(req.body.email, key, {iv: iv});
    var status =  CryptoJS.AES.encrypt(req.body.status, '3FJSei8zPx').toString();
        //var encryptedemail = CryptoJS.AES.encrypt(encrypted, 'bW5Ks7SIJu');
        var newUser = new User({
          email: encrypted.toString(),
          status: status.toString(),
          fname: CryptoJS.AES.encrypt(req.body.fname, 'c9nMaacr2Y').toString(),
          lname: CryptoJS.AES.encrypt(req.body.lname, 'c9nMaacr2Y').toString(),
          password: req.body.password,
          role: req.body.role
        });
        
        if(encrypted.toString() === newUser.email){
            console.log(true);
        }else{
            console.log(encrypted.toString());
            console.log(newUser.email.toString());
            console.log(false);
        }
        let c = CryptoJS.AES.decrypt(newUser.email, key, {iv: iv});
        console.log(c.toString(CryptoJS.enc.Utf8));
    
        User.createUser(newUser, function(err, user){
          if(err){
            console.log(err);
            console.log('duplicate email');
            res.status(205).send();
          }else{
            const token = jwt.sign(user._id.toJSON(), secret.secret); //user need to be JSONed or causes an error
            console.log(token);
            return res.json({result: true, role: user.role, token});
          }
        });
    });

//deletes user by id
adminRoutes.route('/delete/:id').get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(!user){
            res.status(404).send("user is not found");
        }
        else{
            let email = CryptoJS.AES.decrypt(user.email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            user.status =  CryptoJS.AES.encrypt("Suspended", '3FJSei8zPx');
            user.save().then(user => {
                res.json('User deleted');
                logger.info('User: '+email+' has been suspended');
                winston.info('User: '+email+' has been suspended');
            })
            .catch(err => {
                res.status(400).send("Delete not possible");
                logger.error('User:'+email+' could not be suspended. Error: ' + err)
                winston.error('User:'+email+' could not be suspended. Error: ' + err)
            });
        }
    });
  });   

adminRoutes.route('/reactivate/:id').get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(!user ){
            res.status(404).send("user is not found");
        }
        else{
            let email = CryptoJS.AES.decrypt(user.email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            user.status =  CryptoJS.AES.encrypt("Active", '3FJSei8zPx');
            user.save().then(user => {
                res.json('User reactivated');
                logger.info('User: '+email+' has been reactivated')
                winston.info('User: '+email+' has been reactivated')
            })
            .catch(err => {
                res.status(400).send("Reactivation not possible");
                 winston.error('User:'+email+' could not be reactivated. Error: ' + err)
            });
        }

    })
})

//checks if user password reset token is valid
adminRoutes.route('/reset-staff/:token').get(function(req, res) {
        User.findOne({password_token: req.params.token, password_expires: {$gt: Date.now()}}).then((staff) => {
          if (staff == null) {
            console.error('password reset link is invalid or has expired');
			winston.error('user password reset link is invalid or has expired');
            res.status(403).send('password reset link is invalid or has expired');
          } 
          else {
			  winston.info('user password rest link recevied status 200');
              res.status(200).send({
                staff_id: staff._id,
                message: 'password reset link a-ok',
              });
          }
        });
      });  

//sends password reset email for staff
adminRoutes.route('/send-email-staff').post(function(req, res) {
        let logger = databaseLogger.createLogger(req.body.email)
        var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        var email = CryptoJS.AES.encrypt(req.body.email, key, {iv: iv}).toString();
		winston.info('password reset email has been sent to' + email.toString() );
        User.findOne({email: email}, function(err, staff) {
            console.log(email);
			winston.info(staff);
            if (!staff){
                res.status(404).send("Email is not found");
                winston.error('Staff email was not found: ' + req.body.email);
                logger.error('Staff email was not found: ' + req.body.email);
            }
            else{
                const token = crypto.randomBytes(20).toString('hex');
                staff.password_token = token;
                staff.password_expires = Date.now() + 3600000;
                staff.save().then(()=>
				console.log('email token generated'),
				winston.info('user has had a reset email sent to them'));
                var transporter = nodeMailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.SYSTEM_EMAIL,
                        pass: process.env.SYSTEM_PASSWORD
                    }
                });
                var mailOptions = {
                    from: process.env.SYSTEM_EMAIL, // sender address
                    to: req.body.email, // list of receivers
                    subject: 'Password Reset', // Subject line
                    text: 'Please navigate to the following link to activate your staff account and set your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePasswordStaff/'+token // plain text body
                }            
    
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(mailOptions.text);
						winston.error(error);
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    winston.info('Message %s sent: %s', info.messageId, info.response);
                    logger.verbose('Staff password reset email sent to: ' + req.body.email);
                    res.status(200).json({'email': 'Email Sent'});
                });
            }
        });
    });
    
//updates user password      
adminRoutes.route('/update-password-staff/:token').post(function(req, res) {
        //encrypt before updating
        User.findOne({password_token: req.params.token}, function(err, staff) {
            if (!staff)
                res.status(404).send("data is not found");
            else{
                let email = CryptoJS.AES.decrypt(staff.email
                    , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                    , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                    .toString(CryptoJS.enc.Utf8)
                let logger = databaseLogger.createLogger(email);
                var active =  CryptoJS.AES.encrypt("Active", '3FJSei8zPx').toString();
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        req.body.password = hash;
                        staff.status = active
                        staff.password = req.body.password;
                        staff.save().then(staff => {
                        winston.info('User: '+email+' has updated thier password')
                        logger.info('User: '+email+' has updated thier password')
                        res.json('Password updated!');
                    })
                    .catch(err => {
                        winston.error('User: '+email+' could not update thier password. Error: ' + err);
                        logger.error('User: '+email+' could not update thier password. Error: ' + err);
                        res.status(400).send("Update not possible");
                    });
                    });
                  });
            }      
        });
    });  
    
    adminRoutes.route('/getRecord/:id').get(function(req, res){
        User.findById(req.params.id, function(err, user){
            let logger = databaseLogger.createLogger('universal')
            if(!user){
                Trainee.findById(req.params.id, function(err, trainee){
                    if(!trainee){
                        winston.error("User not found")
                        logger.error("User not found")
                    }
                    else{
                        let email = CryptoJS.AES.decrypt(trainee.trainee_email
                            , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                            , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                            .toString(CryptoJS.enc.Utf8);
                        Records.find({label: email}, function(err, records){
                            res.json(records);
                        })    
                    }
                })
            }
            else{
                let email = CryptoJS.AES.decrypt(user.email
                    , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                    , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                    .toString(CryptoJS.enc.Utf8);
                Records.find({label: email}, function(err, records){
                    res.json(records);
                })       
            }   
        })
    })

    adminRoutes.route('/getAllRecords').get(function(req,res){
        Records.find(function(err, record){
            console.log("records"+record)
            res.json(record)
        })
    })

module.exports = adminRoutes;