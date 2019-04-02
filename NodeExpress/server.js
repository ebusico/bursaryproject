const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const traineeRoutes = express.Router();
const nodeMailer = require('nodemailer');
const PORT = 4000;

let Trainee = require('./trainee.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/trainees', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

traineeRoutes.route('/').get(function(req, res) {
    Trainee.find(function(err, trainee) {
        if (err) {
            console.log(err);
        } else {
            res.json(trainee);
        }
    });
});

traineeRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Trainee.findById(id, function(err, trainee) {
        res.json(trainee);
    });
});

traineeRoutes.route('/update/:id').post(function(req, res) {
    Trainee.findById(req.params.id, function(err, trainee) {
        if (!trainee)
            res.status(404).send("data is not found");
        else
            trainee.trainee_name = req.body.trainee_name;
            trainee.trainee_email = req.body.trainee_email;
            trainee.trainee_password = req.body.trainee_password;
            trainee.trainee_account_no = req.body.trainee_account_no;
            trainee.trainee_sort_code = req.body.trainee_sort_code;

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

traineeRoutes.route('/add').post(function(req, res) {
    let trainee = new Trainee(req.body);
    trainee.save()
        .then(trainee => {
            res.status(200).json({'trainee': 'Trainee added successfully'});
        })
        .catch(err => {
            res.status(400).send('Adding new trainee failed');
        });
});

traineeRoutes.route('/send-email').post(function(req, res) {
      let transporter = nodeMailer.createTransport({
          service: 'AOL',
          auth: {
              user: 'QABursary@aol.com',
              pass: 'Passw0rd123'
          }
      });
      let mailOptions = {
          from: 'QABursary@aol.com', // sender address
          to: req.body.trainee_email, // list of receivers
          subject: 'test', // Subject line
          text: 'test', // plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
          res.status(200).json({'email': 'Email Sent'});
      });
});


app.use('/trainee', traineeRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});