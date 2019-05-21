var express = require('express');
var authRoutes = express.Router();

var passport = require ('passport');
var AuthenticationController = require('../config/authentication');

const passportJWT = require("passport-jwt");
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var AuthenticationController = require('../config/authentication');  
var passportService = require('../config/passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session:false});

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

authRoutes.post('/login', requireLogin, AuthenticationController.login); 


authRoutes.get('/protected', requireAuth, function(req, res){
	res.send({ content: 'Success'});
});


module.exports = authRoutes;