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
    Settings.findOne(function(err, settings){
        let logger = databaseLogger.createLogger("universal");
        if (err){
            console.log(err);
            winston.error(err);
            logger.error(err);
        } else{
               // bytes = CryptoJS.AES.decrypt(settings.pay_bank_holidays, '3FJSei8zPx');
               // settings.pay_bank_holidays = bytes.toString(CryptoJS.enc.Utf8);
               // bytes = CryptoJS.AES.decrypt(settings.default_bursary, '3FJSei8zPx');
               // settings.default_bursary = bytes.toString(CryptoJS.enc.Utf8);
        };
        console.log(settings);
        res.json(settings);
        logger.verbose('database collected settings successfully');
			winston.info('database collected settings successfully');
        });
    });
//Edits the settings
settingsRoutes.route('/editSettings', requireAuth, AuthenticationController.roleAuthorization(['admin'])).post(function(req, res){
    Settings.findOne(function(err, settings){
        let logger = databaseLogger.createLogger("universal");
        if(!settings){
            res.status(404).send("no data is not found");
        }else{
                settings.pay_bank_holidays = req.body.bank_holidays.toString();
                settings.default_bursary = req.body.bursary_amount.toString();
                settings.save().then(settings =>{
                    res.json('Settings have been updated: ' + settings.default_bursary);
				    winston.info('Settings have been changed');
                    logger.info('Settings have been changed');
                }).catch(err => {
                    res.status(205).send('Changing settings failed');
                    console.log(err);
                    winston.error('Changing settings failed. Error: '+err);
                    logger.error('Changing settings failed. Error: '+err);
                });
            };
        })
    });


module.exports = settingsRoutes;