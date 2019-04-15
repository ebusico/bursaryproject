const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Trainee = new Schema({
    trainee_fname: {
        type: String
    },
    trainee_lname: {
        type: String
    },
    trainee_email: {
        type: String
    },
    trainee_password: {
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
    }
});

module.exports = mongoose.model('Trainee', Trainee);