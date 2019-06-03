const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let globalSettings = new Schema({
    pay_bank_holidays: {
        type: Boolean,
        required: true
    },
    default_bursary: {
        type: String,
        format: Number,
        required: true
    }
});

module.exports = mongoose.model('settings', Settings);
