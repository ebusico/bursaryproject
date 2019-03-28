const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

// Connection URL
const url = "mongodb://localhost:27017/hello";

MongoClient.connect(url, function(err, db) {
    if (err) return console.log(err);
    console.log("Database connected!");
    
    const dbo = db.db("sampleDB");
    
   insertDocument(dbo, function(){
       db.close()
   });
});

const insertDocument = function(dbo, callback){
    //Get collection
    const collection = dbo.collection("hello");

    //insert documents
    collection.insertOne({"string":"Hello World!"}, function(err, result) {
        if (err) return console.log(err);
        console.log("1 document inserted");
    callback(result);
    });
}
