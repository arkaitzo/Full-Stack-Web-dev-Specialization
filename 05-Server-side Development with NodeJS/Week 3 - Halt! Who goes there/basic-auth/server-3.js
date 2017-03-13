var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var hostname = 'localhost';
var port = 3000;

// #1
var app = express();
app.use(morgan('dev'));

// #2 - Tracking the session
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));

// Adding basic authentication
function auth(req,res,next) {
    console.log(req.headers);
    
    if (!req.session.user) {
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
            req.session.user = 'admin'; // 'req' because the session info is tracked on the server side now
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401; // Authorization has failed!
            next(err); // Raise the error
        }
    }
    else { // Assuming that the cookie is included in the header of the incoming request
        if (req.session.user === 'admin') {
            console.log('req.session: ',req.session);
            next(); // Let the request through
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}

// #3
app.use(auth); // Use the above middleware function

// #4
app.use(express.static(__dirname + '/public'));

// #5 - Handle errors in this middleware
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