const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let settings_schema = new Schema({
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

module.exports = mongoose.model('settings', settings_schema);

var Settings = module.exports = mongoose.model('settings', settings_schema);

module.exports.createSettings = function(newSettings, callback){
        newSettings.save(callback);
    };

    //Runs once on server startup, does nothing if there is a preexisting db with entries.
Settings.count().then((count) => {
    if (count === 0) {
	  var settings = new Settings(JSON.parse(process.env.PREMADE_SETTINGS));
	  var newSettings = new Settings({
        pay_bank_holidays: settings.pay_bank_holidays,
        default_bursary: settings.default_bursary
      });
      Settings.createSettings(newSettings);
    }
  });