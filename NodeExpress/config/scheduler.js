const fs = require('node-fs');
const CronJob = require('cron').CronJob;
const nodeMailer = require('nodemailer');

//will start at midnight
const midnightJob = new CronJob('00 00 00 * * *', function() {
	const d = new Date();
	console.log('Midnight:', d);
});
midnightJob.start();


//Will start every 10 minutes from start up
const tenMinJob = new CronJob('0 */10 * * * *', function() {
	const d = new Date();
	console.log('Every Tenth Minute:', d);
});

tenMinJob.start();

//Will start every second 
/*
const everySecondJob = new CronJob('* * * * * *', function() {
	const d = new Date();
	console.log('Every second:', d);
});

everySecondJob.start();
*/
const autoEmail = new CronJob('0 */10 * * * *', function() {
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
          to: 'enter email here', // list of receivers
          subject: 'Test Cron', // Subject line
          text: 'Hi, this is just a test'// plain text body
         }            
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email successfully sent!");
        }
      });
});
//autoEmail.start();