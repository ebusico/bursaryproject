const mongoose = require('mongoose');


const RecordSchema = new mongoose.Schema({
  timestamp: { 
    type: Date
  },
  level: { 
    type: String
  },
  message: { 
    type: String
  },
  meta: { 
    type: JSON
  },
  label: { 
    type: String
  }
},
{ collection : 'log' })

module.exports = mongoose.model('Record', RecordSchema);