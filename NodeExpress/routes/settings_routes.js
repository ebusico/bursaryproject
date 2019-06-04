var express = require('express');
var settingsRoutes = express.Router();
var async = require("async");
var request = require('request');

var HolidayFeed = require('uk-bank-holidays');
const winston = require('../config/winston');
var databaseLogger = require('../config/winston-db')
var moment = require('moment');
var businessDiff = require('moment-business-days');

const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var requireAuth = passport.authenticate('jwt', {session: false});

let Settings = require('../models/globalSettings.model');
let SortCodeCollection = require('../models/sortcode.model');
let monthlyReports = require('../models/monthlyReport.model');

require('dotenv').config()
let hex = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
let iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

//gets the settings (get all method only get one in this case)
settingsRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin'])).get(function(req, res){
    Settings.find(function(err, settings){
        let logger = databaseLogger.createLogger("universal");
        if (err){
            console.log(err);
            winston.error(err);
            logger.error(err);
        } else{
            settings.map(function(currentSettings, i){
                bytes = CryptoJS.AES.decrypt(currentSettings.pay_bank_holidays, '3FJSei8zPx');
                currentSettings.pay_bank_holidays = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(currentSettings.default_bursary, '3FJSei8zPx');
                currentSettings.default_bursary = bytes.toString(CryptoJS.enc.Utf8);
            });
        console.log(currentSettings);
        res.json(currentSettings);
        logger.verbose('database collected settings successfully');
			winston.info('database collected settings successfully');
        }
    });
});
//Edits the settings
settingsRoutes.route('/editSettings', requireAuth, AuthenticationController.roleAuthorization(['admin'])).get(function(req, res){
    Settings.find(function(err, settings){
        if(!settings){
            res.status(404).send("no data is not found");
        }else{
            settings.map(function(currentSettings, i){
                let pay_bank_holidays = CryptoJS.AES.encrypt(req.body.pay_bank_holidays, '3FJSei8zPx').toString();
                settings.pay_bank_holidays = pay_bank_holidays;
                let default_bursary = CryptoJS.AES.encrypt(req.body.default_bursary, '3FJSei8zPx').toString();
                settings.default_bursary = default_bursary;
                currentSettings.save().then(settings =>{
                    res.json('Settings have been updated');
				    winston.info('Settings have been changed');
                    logger.info('Settings have been changed');
                });
            });
        }
    });
});