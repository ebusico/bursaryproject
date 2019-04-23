var bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const sequelize = require('sequelize');
const Op = sequelize.Op

const traineeRoutes = express.Router();
const authRoutes = express.Router();
const apiRoutes = express.Router();
const adminRoutes = express.Router();

const nodeMailer = require('nodemailer');
const PORT = 4000;
const bcrypt = require('bcrypt');
const passportJWT = require("passport-jwt");

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var AuthenticationController = require('./config/authentication');  
var passportService = require('./config/passport');
var passport = require ('passport');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var User = require('./models/staff.js');
var CryptoJS = require("crypto-js");
var options = { mode: CryptoJS.mode.ECB, padding:  CryptoJS.pad.Pkcs7};
var secret = require('./config/auth.js');

let Trainee = require('./trainee.model');

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
/*
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
*/
//Auth variables
var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session:false});

// Auth Routes 
//traineeRoutes.use('/auth', authRoutes);

adminRoutes.route('/addUser').post(function(req,res){
      
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });

    User.createUser(newUser, function(err, user){
      if(err){
          console.log(err);
          console.log('duplicate email');
          res.status(205).send();
      }
      else{
      const token = jwt.sign(user._id.toJSON(), secret.secret); //user need to be JSONed or causes an error
        console.log(token);
        return res.json({result: true, role: user.role, token});
      }
    });
});

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

  //endpoint for deleting a trainer user
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


// Endpoint to login
/* POST login. */
authRoutes.post('/login', requireLogin, AuthenticationController.login); 


authRoutes.get('/protected', requireAuth, function(req, res){
	res.send({ content: 'Success'});
});

// Endpoint to get current user
traineeRoutes.route('/user').get(function(req, res){
  res.send(req.user);
})
// Endpoint to logout
traineeRoutes.route('logout').get(function(req, res){
  req.logout();
  res.send(null)
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
		if (err){
			console.log(err);
		}else{
      done(err, user);
		}
    });
  });
// Auth with Trainee routes

apiRoutes.use('/trainee', traineeRoutes);

mongoose.connect('mongodb://localhost:27017/trainees', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
// RBAC control for all /trainee
//app.all('/trainee', requireAuth, AuthenticationController.roleAuthorization(['admin','recruiter','finance']));

traineeRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin','recruiter','finance'])).get(function(req, res) {
    Trainee.find(function(err, trainee) {
        if (err) {
            console.log(err);
        } else {
            res.json(trainee);
        }
    });
});


traineeRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Trainee.findById(id, function(err, trainee) {
         res.json(trainee);
    })
    .catch(err => {
        res.status(400).send("Trainee doesn't exist");
    });
})   

adminRoutes.route('/staff/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, staff) {
         res.json(staff);
    })
    .catch(err => {
        res.status(400).send("Staff doesn't exist");
    });
});

adminRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin'])).get(function(req, res) {
    User.find(function(err, staff) {
        if (err) {
            console.log(err);
        } else {
            res.json(staff);
        }
    });
});


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

traineeRoutes.route('/update-password/:token').post(function(req, res) {
    Trainee.findOne({trainee_password_token: req.params.token}, function(err, trainee) {
        if (!trainee)
            res.status(404).send("data is not found");
        else
            //bcrypt pass
            var bytes  = CryptoJS.AES.decrypt(req.body.trainee_password, '3FJSei8zPx');
            var decryptPass = bytes.toString(CryptoJS.enc.Utf8);
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

adminRoutes.route('/update-password-staff/:token').post(function(req, res) {
    User.findOne({password_token: req.params.token}, function(err, staff) {
        if (!staff)
            res.status(404).send("data is not found");
        else
            //bcrypt pass
            var bytes  = CryptoJS.AES.decrypt(req.body.password, 'c9nMaacr2Y');
            var decryptPass = bytes.toString(CryptoJS.enc.Utf8);
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

traineeRoutes.route('/add').post(function(req, res) {
    let trainee = new Trainee(req.body);
    //var encryptedemail = CryptoJS.AES.encrypt(req.body.email, key, options);
    //trainee.trainee_email = encryptedemail.toString(); 
    trainee.save()
        .then(trainee => {
            res.status(200).json({'trainee': 'Trainee added successfully'});
        })
        .catch(err => {
            res.status(205).send('Adding new trainee failed');
        });
});


traineeRoutes.route('/send-email').post(function(req, res) {
    var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
    var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
    var email = CryptoJS.AES.decrypt(req.body.trainee_email, key, {iv:iv});
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
                text: 'Please navigate to the following link to activate your QA bursary account and set your password: http://localhost:3000/changePassword/'+token // plain text body
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
                text: 'Please navigate to the following link to activate your staff account and set your password: http://localhost:3000/changePasswordStaff/'+token // plain text body
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

app.use('/trainee', traineeRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
})