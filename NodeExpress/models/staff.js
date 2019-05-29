const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js");


const UserSchema = new mongoose.Schema({
  email: { 
  type: String, 
  required: true, 
  unique: true 
  },
  password: { 
  type: String, 
  required: true 
  },
  fname: {
    type: String,
    required: true
  },
  lname:{
    type: String,
    required: true
  },
  role: { 
  type: String, 
  enum:['recruiter','admin','finance'],
  default: 'admin',
  required: true
  },
  status:{
    type: String,
    // enum:['Incomplete', 'Active', 'Suspended'],
    // default: 'Incomplete',
    required: true
  },
  password_token:{
    type: String
  },
  password_expires:{
    type: String,
    format: Date
  }
},
{
  timestamps:true
});

module.exports = mongoose.model('User', UserSchema);



module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  }

  var User = module.exports = mongoose.model('User', UserSchema);
  
  module.exports.getUserByEmail = function(email, callback){
    var query = {email: email};
    User.findOne(query, callback);
  }
  
  module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
  }
  
  module.exports.comparePassword = function(userPassword, hash, callback){
    bcrypt.compare(userPassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
    });
  }

    //Runs once on server startup, does nothing if there is a preexisting db with entries.
  User.count().then((count) => {
    if (count === 0) {
	  var admin = new User(JSON.parse(process.env.PREMADE_ADMIN));
	  var newUser = new User({
        email: CryptoJS.AES.encrypt(admin.email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(),
        password: admin.password,
        fname: CryptoJS.AES.encrypt(admin.fname, 'c9nMaacr2Y').toString(),
        lname: CryptoJS.AES.encrypt(admin.lname, 'c9nMaacr2Y').toString(),
        role: admin.role,
        status: CryptoJS.AES.encrypt(admin.status, '3FJSei8zPx').toString()
      });
      User.createUser(newUser);
    }
  });