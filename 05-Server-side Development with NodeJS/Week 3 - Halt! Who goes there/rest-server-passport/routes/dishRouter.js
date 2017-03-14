var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

// URI: /
dishRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next) {
    // Will result in MongoDB returning ALL the documents of the "dishes" collection as an JS array
    Dishes.find({}, function (err,dish) {
        if (err) throw err;
        res.json(dish); // Convert the JS array to a JSON object
        // The headers will be automatically set with a status code "200" and content type "application/json"
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    // Will result in the insertion of a new item into a collection in MongoDB using mongoose
    Dishes.create(req.body, function (err,dish) { // "req.body" has already been parsed by the bodyParser and converted into JSON
        if (err) throw err;
        console.log('\nDish created!');
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the dish with id: ' + id);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    // Will remove all the items in the collection
    Dishes.remove({}, function (err,resp) { // "remove" is another operation supported by mongoose
        if (err) throw err;
        res.json(resp); // How many dishes have been deleted
    });
});

// URI: ../:dishId
dishRouter.route('/:dishId')
.get(Verify.verifyOrdinaryUser, function (req,res,next) {
    Dishes.findById(req.params.dishId, function (err,dish) {
        if (err) throw err;
        res.json(dish);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    Dishes.findByIdAndUpdate(req.params.dishId,
                             {
        $set: req.body
    },
                             {
        new: true
    },
                             function (err,dish) {
        if (err) throw err;
        res.json(dish);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    Dishes.findByIdAndRemove(req.params.dishId, function (err,resp) { // "findByIdAndRemove" not "remove"
        if (err) throw err;
        res.json(resp);
    });
});

// URI: ../:dishId/comments
dishRouter.route('/:dishId/comments')
.get(Verify.verifyOrdinaryUser, function (req,res,next) {
    Dishes.findById(req.params.dishId, function (err,dish) {
        if (err) throw err;
        res.json(dish.comments);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    Dishes.findById(req.params.dishId, function (err,dish) {
        if (err) throw err;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    Dishes.findById(req.params.dishId, function (err,dish) {
        if (err) throw err;
        for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save(function (err,result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

// URI: ../:dishId/comments/:commentId
dishRouter.route('/:dishId/comments/:commentId')
.get(Verify.verifyOrdinaryUser, function (req,res,next) {
    Dishes.findById(req.params.dishId, function (err,dish) {
        if (err) throw err;
        res.json(dish.comments.id(req.params.commentId));
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId, function (err,dish) {
        if (err) throw err;
        dish.comments.id(req.params.commentId).remove();
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req,res,next) {
    Dishes.findById(req.params.dishId, function (err,dish) {
        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});


// Export the module "dishRouter"
module.exports = dishRouter;