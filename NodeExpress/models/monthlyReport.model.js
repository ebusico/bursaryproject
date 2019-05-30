const mongoose = require('mongoose');


const MonthlySchema = new mongoose.Schema({
  month: { 
  type: String, 
  required: true, 
  unique: true 
  },
  totalDays: {
    type: String,
    required: true
  },
  totalDailyPayments: {
    type: String,
    required: true
  },
  totalAmount: {
    type: String,
    required: true
  },
  status: {
    type: String,
    //enums ['PendingApproval', 'AdminApproved', 'FinanceApproved']
    required: true
  }
}
);

module.exports = mongoose.model('Monthly.Report', MonthlySchema);