var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

// #1
var app = express();

app.use(morgan('dev'));

// Adding basic authentication
function auth(req,res,next) {
    console.log(req.headers);
    
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        err.status = 401; // Authorization has failed!
        next(err);
        return; // Raise the error and return
    }
    
    // Otherwise, parse the authorization header
    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':'); // Basic base64encodedString -> user:pass
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        err.status = 401; // Authorization has failed!
        next(err); // Raise the error
    }
}

// #2
app.use(auth); // Use the above middleware function

// #3
app.use(express.static(__dirname + '/public'));

// #4 - Handle errors in this middleware
app.use(function(err,req,res,next) {
    res.writeHead(err.status || 500, { // Default 500 (Internal Server Error) if you do not know what else to say
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

app.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});