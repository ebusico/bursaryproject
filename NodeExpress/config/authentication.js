var jwt = require('jsonwebtoken');
var User = require('../models/staff');
var secret = require('./auth');
var winston = require('./winston');
var CryptoJS = require("crypto-js");

// JWT token
function generateToken(user){
	return jwt.sign(user, secret.secret, {
		expiresIn: 10080
	});
}

function setUserInfo(request){
	console.log(request.status);
	console.log(CryptoJS.AES.decrypt(request.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8));
	return {
	_id: request._id,
	role: request.role,
	status: CryptoJS.AES.decrypt(request.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8)
};
}

exports.login = function(req, res, next){
	var userInfo = setUserInfo(req.user);
	console.log(userInfo)
	res.status(200).json({
			   token: 'JWT' + generateToken(userInfo),
			   user: userInfo
	});
}

//Authentication 
exports.roleAuthorization = function(roles){
	return function (req, res, next) {
		var user_id = req.user._id;
		var user = req.user;
		User.findById(user._id, function(err, foundUser){
			if(err){
				res.status(422).json({error: 'No user found.'});
				console.log('no user found ' + err);
				winston.error('no user found ' + err);
				return next (err);
			}
			if(role.indexOf(foundUser.role) > -1){
				return next();
			}
			res.status(401).json({message: 'You are not authourized to access this content'});
			console.log('User ' + user_id + ' tried to access unauthroized content');
			winston.info('User '+ user_id + ' tried to access unauthroized content');
			return next('Unauthorized');
		});
	}
}