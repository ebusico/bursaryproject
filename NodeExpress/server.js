const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const traineeRoutes = express.Router();
const nodeMailer = require('nodemailer');
const PORT = 4000;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var User = require('./models/staff.js');
var CryptoJS = require("crypto-js");
var options = { mode: CryptoJS.mode.ECB, padding:  CryptoJS.pad.Pkcs7};
var key = CryptoJS.enc.Hex.parse('bW5Ks7SIJu');

let Trainee = require('./trainee.model');

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());


traineeRoutes.route('/register').post(function(req,res){
        var encryptedemail = CryptoJS.AES.encrypt(req.body.email, key, options);
        var newUser = new User({
          email: encryptedemail.toString(),
          password: req.body.password,
          role: req.body.role
        });

        User.createUser(newUser, function(err, user){
          if(err) throw err;
          res.send(user).end()
        });
});

// Endpoint to login
traineeRoutes.route('/login').post(passport.authenticate('local'),
  function(req, res) {
    res.send({result: true, email: req.user.email});
  }
);

// Endpoint to get current user
traineeRoutes.route('/user').get(function(req, res){
  res.send(req.user);
})


// Endpoint to logout
traineeRoutes.route('logout').get(function(req, res){
  req.logout();
  res.send(null)
});


var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(email, password, done) {
    var encryptedemail = CryptoJS.AES.encrypt(email, key, options);
    var mail = encryptedemail.toString();
    console.log(mail);
    User.getUserByEmail(mail, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
     	if(isMatch){
     	  return done(null, user);
     	} else {
     	  return done(null, false, {message: 'Invalid password'});
     	}
     });
   });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

mongoose.connect('mongodb://localhost:27017/trainees', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

traineeRoutes.route('/').get(function(req, res) {
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

//traineeRoutes.route('/update-password/:id').post(function(req, res) {
//    Trainee.updateOne(
//        {_id: req.params.id},
//        { $set: { trainee_password: req.body.trainee_password }},
//        function(err, trainee) {
//           if (err) res.status(400).send("Password update not possible");
//    });
//});
traineeRoutes.route('/update-password/:id').post(function(req, res) {
    Trainee.findById(req.params.id, function(err, trainee) {
        if (!trainee)
            res.status(404).send("data is not found");
        else
            trainee.trainee_password = req.body.trainee_password;

            trainee.save().then(trainee => {
                res.json('Password updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});


traineeRoutes.route('/add').post(function(req, res) {
    let trainee = new Trainee(req.body);
    trainee.save()
        .then(trainee => {
            res.status(200).json({'trainee': 'Trainee added successfully'});
        })
        .catch(err => {
            res.status(400).send('Adding new trainee failed');
        });
});

traineeRoutes.route('/send-email').post(function(req, res) {
      let transporter = nodeMailer.createTransport({
          service: 'AOL',
          auth: {
              user: 'QABursary@aol.com',
              pass: 'Passw0rd123'
          }
      });
      let mailOptions = {
          from: 'QABursary@aol.com', // sender address
          to: req.body.trainee_email, // list of receivers
          subject: 'test', // Subject line
          text: 'test', // plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
          res.status(200).json({'email': 'Email Sent'});
      });
});


app.use('/trainee', traineeRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});