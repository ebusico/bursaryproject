var passport = require ('passport');
var User = require('../models/staff.js');
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
    var bytes  = CryptoJS.AES.decrypt(password, 'c9nMaacr2Y');
	
    var decryptPass = bytes.toString(CryptoJS.enc.Utf8);

    User.getUserByEmail(email, function(err, user){
      if(err){
	  return done(err);
	  }
      if(!user){
        return done(null, false, {message: 'Login Failed. Please enter correct details'});
      }
	  
      User.comparePassword(decryptPass, user.password, function(err, isMatch){
        if(err){
		return done(err);
		}
     	if(!isMatch){
		return done(null, false, {message: 'Password is incorrect.'});
     	} else {
		return done(null, user);
		}
     });
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