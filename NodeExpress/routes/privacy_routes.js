var express = require('express');
var privacyRoutes = express.Router(); 
var CryptoJS = require("crypto-js");

let PrivacyRecords = require('../models/gdpr.model');


privacyRoutes.get('/:id', function(req, res){
    console.log(req.params.id);
    PrivacyRecords.findOne({user : req.params.id}, function(err, record){
        if(!record){
            res.send('Failed');
        }
        else{
            ///decrypting and send back result
            console.log('decrypting and sending');
            let permission = CryptoJS.AES.decrypt(record.permission, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            if(permission === "true"){
                res.send('Success');
            }
            else{
                res.send('Failed');
            }
        }
    }).catch( err => {
        res.status(205).send('An Error has occured');
    }
    );
});

privacyRoutes.get('/accept/:id', function(req, res){
    console.log(req.params.id);
    let user = req.params.id;
    let permission = CryptoJS.AES.encrypt('true', '3FJSei8zPx').toString();
    let newRecord = new PrivacyRecords({permission: permission, user: user});
    console.log(newRecord);
    newRecord.save();
    res.send('Success');
})




module.exports = privacyRoutes;