var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';

// Use connect method to connect to the Server
// Note the use of callbacks functions in every step (wait for the operation to be completed)
MongoClient.connect(url, function (err,db) {
    // In case of error stablishing the connection, the following "assert" will make our app fail and print out the appropriate info.
    assert.equal(err,null);
    console.log("Connected correctly to server");
    
    var collection = db.collection("dishes");
    
    // Access the docs inside this collection
    collection.insertOne({name: "Uthapizza", description: "Test"}, function(err,result) {
        assert.equal(err,null);
        console.log("After Insert:");
        console.log(result.ops); // Log the inserted document
        
        // Retrieve ALL the docs that are part of this collection and transform the returned value into an array of JS objects
        collection.find({}).toArray(function(err,docs) {
            assert.equal(err,null);
            console.log("Found:");
            console.log(docs);
            // Drop the "dishes" collection and close the connection
            db.dropCollection("dishes", function(err,result) {
                assert.equal(err,null);
                db.close();
            });
        });
    });
});