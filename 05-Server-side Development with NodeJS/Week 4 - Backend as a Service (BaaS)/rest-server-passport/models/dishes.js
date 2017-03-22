// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema(
    {
        rating:  {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment:  {
            type: String,
            required: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, // ObjecId of...
            ref: 'User' // ... the user that created this comment -> Reference to the 'User' object
            // We can populate the user information into this document (this comment)
        }
    },
    {
        timestamps: true
    }
);

// create a schema
var dishSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        // Assignment 2 - Task 1
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: false,
            default: ''
        },
        price: {
            type: Currency,
            required: true,
            min: 0
        }, // End of Assignment 2 - Task 1
        description: {
            type: String,
            required: true
        },featured: {
            type: Boolean,
            default:false
        },
        comments:[commentSchema]
    },
    {
        timestamps: true
    }
);

// the schema is useless so far
// we need to create a model using it
var Dishes = mongoose.model('Dish', dishSchema);

// make this available to our Node applications
module.exports = Dishes;