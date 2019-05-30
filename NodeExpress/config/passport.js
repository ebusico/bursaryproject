var passport = require ('passport');
var User = require('../models/staff.js');
var Trainee = require('../models/trainee.model');
var secret = require('./auth');
var winston = require('./winston');
var databaseLogger = require('../config/winston-db')

var passportJWT = require("passport-jwt");
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

var CryptoJS = require("crypto-js");
var options = { mode: CryptoJS.mode.ECB, padding:  CryptoJS.pad.Pkcs7};

//Looking for email got encrypted code instead

var localLogin = new LocalStrategy(function(email, password, done) {
	var email = CryptoJS.AES.encrypt(email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString();
	var password = CryptoJS.AES.encrypt(password,'c9nMaacr2Y').toString();
    User.getUserByEmail(email, function(err, user){
      // if(err){
	  	// 	return done(err);
	  	// }
      if(!user){
				Trainee.getTraineeByEmail(email, function(err, trainee){
					if(err){
						return done(err);
					}
					else if(!trainee){
						console.log('login failed incorrect email');
						winston.error('login failed incorrect email');
						return done(null, false, {message: 'Login failed. Wrong Email/Password'});
					}
					else{
						let email = CryptoJS.AES.decrypt(trainee.trainee_email
							, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
							, {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
							.toString(CryptoJS.enc.Utf8)
						let logger = databaseLogger.createLogger(email);
						var bytes  = CryptoJS.AES.decrypt(password, 'c9nMaacr2Y');
						var decryptPass = bytes.toString(CryptoJS.enc.Utf8);
						Trainee.comparePassword(decryptPass, trainee.trainee_password, function(err, isMatch){
							if(err){
								logger.error('Unable to login, Error: ' + err);
								return done(err);
							}
							else if(!isMatch){
								console.log('trainee: ' + email + ' entered wrong password');
								winston.verbose('trainee: ' + email + ' entered wrong password');
								return done(null, false, {message: 'Login failed. Wrong Email/Password'});
							}
							else{
								console.log('Trainee: ' + email + ' logged in');
								winston.info('Trainee: ' + email + ' logged in');
								logger.verbose('Trainee: ' + email + ' logged in')
								return done(null, trainee);
							}
						})
					}
				})
      }
	else{
		let email = CryptoJS.AES.decrypt(user.email
			, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
			, {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
			.toString(CryptoJS.enc.Utf8)
		let logger = databaseLogger.createLogger(email);
			var bytes  = CryptoJS.AES.decrypt(password, 'c9nMaacr2Y');
			var decryptPass = bytes.toString(CryptoJS.enc.Utf8);
      User.comparePassword(decryptPass, user.password, function(err, isMatch){
      	if(err){
				console.log(err);
				winston.error(err);
				logger.error('Unable to login, Error: ' + err);
				return done(err);
			}
     		else if(!isMatch){
				console.log('user: ' + user._id + ' entered wrong password');
				winston.error('user: ' + user._id + ' entered wrong password');
			return done(null, false, {message: 'Password is incorrect.'});
			}
			else {
				console.log('User: ' + email + ' has logged in');
				winston.verbose('User: ' + email + ' has logged in');
				logger.verbose('User: ' + email + ' has logged in');
			return done(null, user);
			}
     });}
   });
  });
  
let opts ={};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = secret.secret;

var jwtLogin = new JwtStrategy(opts, function(payload, done){
	User.findById(payload._id, function(err, user){
		if(err){
			return done(err,false);
		}
		if(user){
			done(null, user);
		}else{
			done(null, false);
		}
	});
});
passport.use(jwtLogin);
passport.use(localLogin);