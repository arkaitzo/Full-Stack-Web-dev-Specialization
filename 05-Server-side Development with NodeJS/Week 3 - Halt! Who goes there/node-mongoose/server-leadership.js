var mongoose = require('mongoose'),
    assert = require('assert');

var Leaders = require('./models/leadership');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("\nConnected correctly to server");
    
    // create a new leader
    Leaders.create(
        {
            name: 'Peter Pan',
            image: 'images/alberto.png',
            designation: 'Chief Epicurious Officer',
            abbr: 'CEO',
            description: 'Our CEO, Peter, ...'
        },
        
        function (err, leader) {
            if (err) throw err;
            console.log('\nLeader created!');
            console.log(leader);
            
            var id = leader._id; // Capturing the leader ID

            // get all the leaders
            setTimeout(function () { // This delay is introduced on purpose (it's not neccesary)
                Leaders.findByIdAndUpdate(id, {$set: {description: '[Updated] Our CEO, Peter, ...'}},
                                         {new: true}) // Return the updated leader
                // Now execute the query above
                .exec(function (err, leader) {
                    if (err) throw err;
                    console.log('\nUpdated Leader!');
                    console.log(leader);
                    
                    /*
                    // Display price having used mongoose-currency module
                    console.log('\nConverted price: $' + (leader.price/100).toFixed(2) );
                    */
                    
                    // Drop the collection "leaders" and close the connection
                    db.collection('leaders').drop(function () {
                        db.close();
                    });
                    
                });
            }, 1000);
        });
});