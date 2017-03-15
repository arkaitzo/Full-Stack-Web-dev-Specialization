var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var Verify    = require('./verify');

// Assignment 3.3 - Allowing an "admin" user to be able to GET all the registered users' info. from the db
// URI: /users/ - GET users listing
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    //res.send('respond with a resource');
    User.find({}, function (err,user) {
        if (err) throw err;
        res.json(user);
    });
});
// End of Assignment 3.3

// URI: /users/register - Registering a new user
router.post('/register', function(req,res) {
    User.register(new User({ username : req.body.username }),
      req.body.password, function(err,user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        
        if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});

// URI: /users/login - Log an existing user in
router.post('/login', function(req,res,next) {
    passport.authenticate('local', function(err,user,info) {
        if (err) {
            return next(err); // Let the error handler take care of it
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        // If the user exists...
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            
            var token = Verify.getToken(user);
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token // Return the token to the client - The client will send it back as part of every single request
            });
        });
    })(req,res,next);
});

// URI: /users/logout
router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
    
    // At this point we should also destroy the token so that the user can no longer access the server
});

// URI: /users/facebook - The user will be sent to FB for user authentication
router.get('/facebook', passport.authenticate('facebook'),
           function(req, res) {
});

// // URI: /users/facebook/callback - Handling the FB authentication of the user
router.get('/facebook/callback', function(req,res,next) {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            var token = Verify.getToken(user); // Now issue my own token from the client app server side
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req,res,next);
});

module.exports = router;
