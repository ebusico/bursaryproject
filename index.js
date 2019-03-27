const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = "mongodb://localhost:27017/users_db";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database connected!");
    
    const dbo = db.db("users_db");
    
    insertDocument(dbo, function(){
      viewDocuments(dbo, function(){  
        removeDocument(dbo, function(){
        db.close();
      });
    });
   });
});

const insertDocument = function(dbo, callback){
    //Get collection
    const collection = dbo.collection("trainees");

    //insert documents
    collection.insertOne({"first_name":"John","last_name":"Smith"}, function(err, result) {
        if (err) throw err;
        console.log("1 document inserted");
    callback(result);
    });
}

const viewDocuments = function(dbo, callback){
    const collection = dbo.collection("trainees");

    collection.find({ }).toArray(function(err, documents){
        assert.equal(err, null);
        console.log("view all documents")
        console.log(documents);
        callback(documents);
    }); 
}

const removeDocument = function(dbo, callback){ 
    //Get collection
    const collection = dbo.collection("trainees");

    //delete document where first name = john
    collection.deleteOne({"first_name" : "John"}, function (err, result){
    assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Document Removed with specified field");
        callback(result);
    });
}

