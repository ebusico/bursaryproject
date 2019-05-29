const fs = require('node-fs');
const CronJob = require('cron').CronJob;
const nodeMailer = require('nodemailer');
const crypto = require('crypto');
var CryptoJS = require("crypto-js");
let hex = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
let iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

let Trainee = require('../models/trainee.model');

//will start at midnight
const midnightJob = new CronJob('00 00 00 * * *', function() {
	const d = new Date();
	console.log('Midnight:', d);
});
midnightJob.start();

//Will start every 10 minutes from start up
//const tenMinJob = new CronJob('0 */10 * * * *', function() {
	//const d = new Date();
	//console.log('Every Tenth Minute:', d);
//});
//tenMinJob.start();

// Send Trainee an email if they have not updated thier password
const autoEmail =  new CronJob('0 0 */12 * * * *', function() {
	 pending = [];
	 Trainee.find(function(err, trainee) {
		trainee.map(function(currentTrainee){
			let status =CryptoJS.AES.decrypt(currentTrainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			console.log(status);
			let email = CryptoJS.AES.decrypt(currentTrainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
			if(status == 'Pending'){
				const token = crypto.randomBytes(20).toString('hex');
							currentTrainee.trainee_password_token = token;
							currentTrainee.trainee_password_expires = Date.now() + 3600000;
							currentTrainee.save().then(()=>
							console.log('token has been generated'),
							);
				// create mail transporter
			var transporter = nodeMailer.createTransport({
                    service: 'AOL',
                    auth: {
                        user: 'QABursary@aol.com',
                        pass: 'Passw0rd123'
                    }
                });
				//sending an email
			console.log("---------------------");
			console.log("Running Cron Job");
			var mailOptions = {
				from: 'QABursary@aol.com', // sender address
				to: email, // list of receivers
				subject: 'Password Reset', // Subject line
                text: 'Please navigate to the following link to activate your QA bursary account and set your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePassword/'+token // plain text body
			}            
			transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					console.log(error);
				}else{
					console.log("Email successfully sent!");
				}
			});
			}
		})
	})
});
autoEmail.start();

// Send Trainee an email if they have not completed thier profile
const autoIncomplete = new CronJob('0 0 */12 * * *', function() {
	 pending = [];
	 Trainee.find(function(err, trainee) {
		trainee.map(function(currentTrainee){
			let status =CryptoJS.AES.decrypt(currentTrainee.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			console.log(status);
			let email = CryptoJS.AES.decrypt(currentTrainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
			if(status == 'Incomplete'){
				// create mail transporter
			var transporter = nodeMailer.createTransport({
                    service: 'AOL',
                    auth: {
                        user: 'QABursary@aol.com',
                        pass: 'Passw0rd123'
                    }
                });
				//sending an email
			console.log("---------------------");
			console.log("Running Cron Job");
			var mailOptions = {
				from: 'QABursary@aol.com', // sender address
				to: email, // list of receivers
				subject: 'Your Details', // Subject line
				text: 'Hi, When you have a moment can you login and fill in your bank details inorder for us to transfer your monthly bursary. Please Login at: http://'+process.env.REACT_APP_AWS_IP+':3000/login'// plain text body
			}            
			transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					console.log(error);
				}else{
					console.log("Email successfully sent!");
				}
			});
			}
		})
	})
});
autoIncomplete.start();