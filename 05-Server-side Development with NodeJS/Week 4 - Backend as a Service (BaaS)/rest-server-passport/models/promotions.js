// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// create a schema
var promotionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
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
        },
        description: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            default:false
        }
    },
    {
        timestamps: true
    }
);

// the schema is useless so far
// we need to create a model using it
var Promotions = mongoose.model('Promotion', promotionSchema);

// make this available to our Node applications
module.exports = Promotions;