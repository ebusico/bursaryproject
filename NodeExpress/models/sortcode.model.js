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
    type: String
    },
})

module.exports = mongoose.model('SortCode', SortCodeSchema);