var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy; // Adding the Facebook authentication strategy
var User = require('./models/user');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up the Facebook strategy for user authentication
exports.facebook = passport.use(new FacebookStrategy( {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({ OauthId: profile.id }, function(err, user) {
        if(err) {
            console.log(err); // handle errors!
        }
        if (!err && user !== null) {
            done(null, user); // The user already exists in my database - Call the callback function "done" and return the user
        } else { // Otherwise, create a new user in our database
            user = new User( {
                username: profile.displayName
            });
            user.OauthId = profile.id;
            user.OauthToken = accessToken;
            user.save(function(err) {
                if(err) {
                    console.log(err); // handle errors!
                } else {
                    console.log("saving user ...");
                    done(null, user); // Once it's done, call the callback function and return the user information
                }
            });
        }
    });
}));