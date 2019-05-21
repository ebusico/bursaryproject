var express = require('express');
var adminRoutes = express.Router();

const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const winston = require('../config/winston');

var jwt = require('jsonwebtoken');
var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var secret = require('../config/auth.js');
var requireAuth = passport.authenticate('jwt', {session: false});

let User = require('../models/staff');

//gets all users
adminRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin'])).get(function(req, res) {
    User.find(function(err, staff) {
        if (err) {
           console.log(err);
        } else {
            res.json(staff);
        }
    });
});

//gets single user by id
adminRoutes.route('/staff/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, staff) {
         res.json(staff);
    })
    .catch(err => {
        res.status(400).send("Staff doesn't exist");
    });
});

//gets single user by email
adminRoutes.route('/getByEmail').post(function(req,res) {
    User.findOne({email: req.body.staff_email}, function(err, user) {
        res.json(user);
    })
    .catch(err => {
        res.status(205).send("User doesn't exist");
    })
})

//adds new user to database
adminRoutes.route('/addUser', requireAuth).post(function(req,res){
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });

    User.createUser(newUser, function(err, user){
      if(err){
          console.log(err);
          console.log( current_user + ' duplicate email');
          res.status(205).send();
      }
      else{
      const token = jwt.sign(user._id.toJSON(), secret.secret); //user need to be JSONed or causes an error
        console.log(token);
		console.log(' created '+ user.role + ' ' + user._id );
        return res.json({result: true, role: user.role, token});
      }
    });
});

//adds user with encryption(used to add users directly from postman)
adminRoutes.route('/addUser/postman').post(function(req,res){
    CryptoJS.pad.NoPadding = {pad: function(){}, unpad: function(){}};
    var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
    var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
    
    var encrypted = CryptoJS.AES.encrypt(req.body.email, key, {iv: iv});
        //var encryptedemail = CryptoJS.AES.encrypt(encrypted, 'bW5Ks7SIJu');
        var newUser = new User({
          email: encrypted.toString(),
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
              throw err;
          }
          const token = jwt.sign(user._id.toJSON(), secret.secret); //user need to be JSONed or causes an error
            console.log(token);
            return res.json({result: true, role: user.role, token});
          res.send(user).end()
        });
    });

//deletes user by id
adminRoutes.route('/delete/:id').get(function(req, res) {
        User.remove({_id: req.params.id}, function(err, user) {
            if(!err){
                res.json({'result':true});
            }
            else{
                console.log(err);
                res.json({'result': false});
            }
    });
    });   

//checks if user password reset token is valid
adminRoutes.route('/reset-staff/:token').get(function(req, res) {
        User.findOne({password_token: req.params.token, password_expires: {$gt: Date.now()}}).then((staff) => {
          if (staff == null) {
            console.error('password reset link is invalid or has expired');
            res.status(403).send('password reset link is invalid or has expired');
          } else {
            res.status(200).send({
              staff_id: staff._id,
              message: 'password reset link a-ok',
            });
          }
        });
      });  

//sends password reset email for staff
adminRoutes.route('/send-email-staff').post(function(req, res) {
        var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
        var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        var email = CryptoJS.AES.decrypt(req.body.email, key, {iv:iv});
        console.log(email.toString(CryptoJS.enc.Utf8));
        User.findOne({email: req.body.email}, function(err, staff) {
            console.log(staff)
            if (!staff){
                res.status(404).send("Email is not found");
            }
            else{
                const token = crypto.randomBytes(20).toString('hex');
                staff.password_token = token;
                staff.password_expires = Date.now() + 3600000;
                staff.save().then(()=>console.log('token generated'));
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
                    text: 'Please navigate to the following link to activate your staff account and set your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePasswordStaff/'+token // plain text body
                }            
    
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(mailOptions.text);
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    res.status(200).json({'email': 'Email Sent'});
                });
            }
        });
    });
    
//updates user password      
adminRoutes.route('/update-password-staff/:token').post(function(req, res) {
        User.findOne({password_token: req.params.token}, function(err, staff) {
            if (!staff)
                res.status(404).send("data is not found");
            else
                //bcrypt pass
                //var bytes  = CryptoJS.AES.decrypt(req.body.password, 'c9nMaacr2Y');
                var decryptPass = CryptoJS.AES.decrypt(req.body.password, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(decryptPass, salt, function(err, hash) {
                      req.body.password = hash;
                      staff.password = req.body.password;
                      staff.save().then(staff => {
                        res.json('Password updated!');
                    })
                    .catch(err => {
                        res.status(400).send("Update not possible");
                    });
                    });
                  });
        });
    });      

module.exports = adminRoutes;