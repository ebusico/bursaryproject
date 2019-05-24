# Bursary App V1

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

- Open <Local_Git_Folder>/NodeExpress/.env

- Edit REACT_APP_AWS_IP and REACT_APP_DATABASE_IP values with the IP addresses of your deployment server(localhost for local deployment)

Note: if you are connecting to a local mongo database you will need to add an admin account so you can login to the app. You can add one by sending a POST request to localhost:4000/admin/addUser/postman (you can use Postman to do this) with the followinf JSON body:
```
    {
        "role": "admin",
        "email": "adamadmin@qa.com",
        "password": "adam",
        "status" : "Active"
    }

```

- Navigate to <Local_Git_Folder>/NodeExpress and and run:
```
npm install
node server.js
```

## Start React App
- Open <Local_Git_Folder>/REACT/.env

- Edit Rthe EACT_APP_AWS_IP value with the IP address of your deployment server(localhost for local deployment)

- Navigate to <Local_Git_Folder>/React and and run:
```
npm install
npm start
```

Navigate to localhost:3000 to test deployment.
