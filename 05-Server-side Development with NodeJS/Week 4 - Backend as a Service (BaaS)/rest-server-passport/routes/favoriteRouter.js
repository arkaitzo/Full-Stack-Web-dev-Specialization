var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

// URI: /favorites/
favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next) {
    Favorites.findOne({'postedBy': req.decoded._doc._id}, '')
        .populate('postedBy dishes') // Populate the info of dishes and individual users into the document
        .exec(function (err,favorite) {
            if (err) throw err;
            res.json(favorite);
    });

})
.post(function (req,res,next) {
    Favorites.findOne({'postedBy': req.decoded._doc._id}, '', function (err, favorite) {
        if (err) throw err;
        
        if (favorite == null) { // Create a favorites document corresponding to this user
            favorite = new Favorites();
            favorite.postedBy = req.decoded._doc._id;
            favorite.dishes.push(req.body._id);
            favorite.save(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });    
        } else { // The favorites document for this user already exists
            if (favorite.dishes.indexOf(req.body._id) > -1) { // Other valid condition: String(favorite.dishes).includes(req.body._id)
                // The dish is in the favorites document already
                res.json(favorite);
            } else {
                // Add the dish to the favorites of this already existing user
                favorite.dishes.push(req.body._id);
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    res.json(favorite);
                });
            }
        }
    });
})
.delete(function (req,res,next) {
    // Delete the list of favorites corresponding to this particular user
    Favorites.remove({'postedBy': req.decoded._doc._id}, function (err,favorite) {
        if (err) throw err;
        res.json(favorite);
    });
});


// URI: /favorites/:dishId
favoriteRouter.route('/:dishId')
.all(Verify.verifyOrdinaryUser)
.delete(function (req,res,next) {
    console.log("Plato a borrar: " + req.params.dishId);
    Favorites.findOne({'postedBy': req.decoded._doc._id}, '', function (err, favorite) {
        if (err) throw err;
        favorite.dishes.pull(req.params.dishId);
        favorite.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});


// Export the module "favoriteRouter"
module.exports = favoriteRouter;


// 58cab19d3552f2078eb84405 58cab1913552f2078eb84404