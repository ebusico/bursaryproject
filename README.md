# Skeleton App V2

As a prerequiste Node.js needs to be installed

# Deployment
## Setup Database

- Install MongoDB from: https://www.mongodb.com/download-center/community
- Add install directory to your environment variables (default is "C:\Program Files\MongoDB\Server\4.0\bin")
- Open command window and run:
```
mongod
mongo
use trainees
```

## Start Express/Node App

- Open <Local_Git_Folder>/NodeExpress/server.js

- Edit the "/send-email" route by replacing "<Service>" with you email provider, "<Sender Email>" with your email and "<Sender Password>" with your email password.

Example:
```
traineeRoutes.route('/send-email').post(function(req, res) {
      let transporter = nodeMailer.createTransport({
          service: 'GMail',
          auth: {
              user: 'example@gmail.com',
              pass: 'password'
          }
      });
      let mailOptions = {
          from: 'example@gmail.com', // sender address
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

```

- Navigate to <Local_Git_Folder>/NodeExpress and and run:
```
npm install
node server.js
```

## Start React App

- Navigate to <Local_Git_Folder>/React and and run:
```
npm install
npm start
```

Navigate to localhost:3000 to test deployment.

## Troubleshooting

If the email fails to authenticate, it may be neccessary to allow "less secure apps" to access the chosen email address. Please refer to your email provider for details on how to do so.
