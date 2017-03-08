var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// Require the Node modules within this Express application
var dishRouter = require('./dishRouter');
var promoRouter = require('./promoRouter');

// Mount the Node modules on the corresponding routes
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});