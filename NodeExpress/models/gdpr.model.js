const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gdprSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model('Policies', gdprSchema);
