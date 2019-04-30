var jwt = require('jsonwebtoken');
var User = require('../models/staff');
var secret = require('./auth');

// JWT token
function generateToken(user){
	return jwt.sign(user, secret.secret, {
		expiresIn: 10080
	});
}

function setUserInfo(request){
	return {
	_id: request._id,
	role: request.role
};
}

exports.login = function(req, res, next){

	var userInfo = setUserInfo(req.user);
	res.status(200).json({
			   token: 'JWT' + generateToken(userInfo),
			   user: userInfo
		   });
}

//Authentication 
exports.roleAuthorization = function(roles){
	return function (req, res, next) {
		var user = req.user;
		User.findById(user._id, function(err, foundUser){
			if(err){
				res.status(422).json({error: 'No user found.'});
				return next (err);
			}
			if(role.indexOf(foundUser.role) > -1){
				return next();
			}
			res.status(401).json({message: 'You are not authourized to access this content'});
			return next('Unauthorized');
		});
	}
}