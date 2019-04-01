const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Trainee = new Schema({
    trainee_name: {
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
    }
});

module.exports = mongoose.model('Trainee', Trainee);