const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let Trainee = new Schema({
    trainee_fname: {
        type: String,
        required: true
    },
    trainee_lname: {
        type: String,
        required: true
    },
    trainee_email: {
        type: String,
        required: true, 
        unique: true 
    },
    trainee_password: {
        type: String,
        required: true
    },
	trainee_bank_name: {
		type: String
	},
    trainee_account_no: {
        type: String
    },    
    trainee_sort_code: {
        type: String
    },
    trainee_approved:{
        type: Boolean,
        default: false
    },
    trainee_password_token:{
        type: String
    },
    trainee_password_expires:{
        type: String,
        format: Date
    },
    trainee_start_date:{
        type: String,
        required:true
    },
    trainee_end_date:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Trainee', Trainee);

var test = module.exports = mongoose.model('Trainee', Trainee);

module.exports.getTraineeByEmail = function(email, callback){
    var query = {trainee_email: email};
    test.findOne(query, callback);
  }

  
module.exports.comparePassword = function(traineePassword, hash, callback){
    bcrypt.compare(traineePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
    });
  }
