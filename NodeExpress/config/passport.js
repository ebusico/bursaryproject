var passport = require ('passport');
var User = require('../models/staff.js');
var Trainee = require('../trainee.model');
var secret = require('./auth');

var passportJWT = require("passport-jwt");
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

var CryptoJS = require("crypto-js");
var options = { mode: CryptoJS.mode.ECB, padding:  CryptoJS.pad.Pkcs7};

//Looking for email got encrypted code instead

var localLogin = new LocalStrategy(function(email, password, done) {
    console.log(email);
    console.log(password);

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
						return done(null, false, {message: 'Login failed. Wrong Email/Password'});
					}

					var bytes  = CryptoJS.AES.decrypt(password, 'c9nMaacr2Y');
					var decryptPass = bytes.toString(CryptoJS.enc.Utf8);
					Trainee.comparePassword(decryptPass, trainee.trainee_password, function(err, isMatch){
						if(err){
							return done(err);
						}
						else if(!isMatch){
							console.log("trainee fail");
							return done(null, false, {message: 'Login failed. Wrong Email/Password'});
						}
						else{
							return done(null, trainee);
						}
					})
				})
      }
			else{
			var bytes  = CryptoJS.AES.decrypt(password, 'c9nMaacr2Y');
			var decryptPass = bytes.toString(CryptoJS.enc.Utf8);
			console.log(user.password);
			console.log(decryptPass);
      User.comparePassword(decryptPass, user.password, function(err, isMatch){
      if(err){
				return done(err);
			}
     	else if(!isMatch){
				console.log("User fail");
				return done(null, false, {message: 'Password is incorrect.'});
     	} else {
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