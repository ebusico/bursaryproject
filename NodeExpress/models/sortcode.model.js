const mongoose = require('mongoose');


const SortCodeSchema = new mongoose.Schema({
  SortCode: { 
    type: String, 
    required: true
  },
  BankName: { 
    type: String, 
    required: true
  },
  Branch: { 
    type: String, 
    required: true
    },
})

module.exports = mongoose.model('SortCode', SortCodeSchema);