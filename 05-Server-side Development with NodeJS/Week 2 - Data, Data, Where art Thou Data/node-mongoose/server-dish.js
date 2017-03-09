var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dish');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("\nConnected correctly to server");
    
    // create a new dish
    Dishes.create(
        {
            name: 'Uthapizza',
            image: 'images/uthapizza.png',
            category: 'mains',
            label: 'Hot',
            price: '4.99',
            description: 'Test',
            comments: [
                {
                    rating: 3,
                    comment: 'This is insane',
                    author: 'Matt Daemon'
                }
            ]
        },
        
        function (err, dish) {
            if (err) throw err;
            console.log('\nDish created!');
            console.log(dish);
            
            var id = dish._id; // Capturing the dish ID

            // get all the dishes
            setTimeout(function () { // This delay is introduced on purpose (it's not neccesary)
                Dishes.findByIdAndUpdate(id, {$set: {description: 'Updated Test'}},
                                         {new: true}) // Return the updated dish
                // Now execute the query above
                .exec(function (err, dish) {
                    if (err) throw err;
                    console.log('\nUpdated Dish!');
                    console.log(dish);
                    
                    dish.comments.push(
                        {
                            rating: 5,
                            comment: 'I\'m getting a sinking feeling',
                            author: 'Leonardo di Carpaccio'
                        }
                    );
                    
                    dish.save(function(err,dish) {
                        console.log('\nUpdated comments!');
                        console.log(dish);
                        
                        /*
                        // Display price having used mongoose-currency module
                        console.log('\nConverted price: $' + (dish.price/100).toFixed(2) );
                        */
                        
                        // Drop the collection "dishes" and close the connection
                        db.collection('dishes').drop(function () {
                            db.close();
                        });
                    });
                    
                });
            }, 1000);
        });
});