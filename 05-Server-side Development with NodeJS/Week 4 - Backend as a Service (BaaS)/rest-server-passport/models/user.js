var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema(
    {
        username: String, // Even if we don't declare 'username', passportLocalMongoose will automatically insert it
        password: String, // Even if we don't declare 'password', passportLocalMongoose will automatically insert it
        admin: {
            type: Boolean,
            default: false
        }
    }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);