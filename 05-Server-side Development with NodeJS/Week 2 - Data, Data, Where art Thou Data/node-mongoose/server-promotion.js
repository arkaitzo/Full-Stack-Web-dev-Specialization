var mongoose = require('mongoose'),
    assert = require('assert');

var Promotions = require('./models/promotions');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("\nConnected correctly to server");
    
    // create a new promotion
    Promotions.create(
        {
            name: 'Weekend Grand Buffet',
            image: 'images/buffet.png',
            label: 'New',
            price: '19.99',
            description: 'Featuring...'
        },
        
        function (err, promotion) {
            if (err) throw err;
            console.log('\nPromotion created!');
            console.log(promotion);
            
            var id = promotion._id; // Capturing the promotion ID

            // get all the promotions
            setTimeout(function () { // This delay is introduced on purpose (it's not neccesary)
                Promotions.findByIdAndUpdate(id, {$set: {description: '[Updated] Featuring...'}},
                                         {new: true}) // Return the updated promotion
                // Now execute the query above
                .exec(function (err, promotion) {
                    if (err) throw err;
                    console.log('\nUpdated Promotion!');
                    console.log(promotion);
                    
                    /*
                    // Display price having used mongoose-currency module
                    console.log('\nConverted price: $' + (promotion.price/100).toFixed(2) );
                    */
                    
                    // Drop the collection "promotions" and close the connection
                    db.collection('promotions').drop(function () {
                        db.close();
                    });
                    
                });
            }, 1000);
        });
});