var http = require('http');
var fs = require('fs');
var path = require('path');

var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function(req, res){
    console.log('Request for ' + req.url + ' by method ' + req.method);
    if (req.method == 'GET') {
        // Handling GET requests...
        var fileUrl;
        if (req.url == '/') fileUrl = '/index.html';
        else fileUrl = req.url;
        
        var filePath = path.resolve('./public'+fileUrl); // Absolute path
        var fileExt = path.extname(filePath); // File extension
        if (fileExt == '.html') {
            // Handling the GET request of a html file
            fs.exists(filePath, function(exists) {
                // If the html file does not exist...
                if (!exists) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<html><body><h1>Error 404: ' + fileUrl +
                            ' not found</h1></body></html>');
                    return;
                }
                // Otherwise...
                res.writeHead(200, { 'Content-Type': 'text/html' });
                fs.createReadStream(filePath).pipe(res); // ... pipe it to the response message
            });
        }
        else {
            // Handling the GET request of a non-html file
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>Error 404: ' + fileUrl +
                    ' not a HTML file</h1></body></html>');
        }
    }
    else {
        // Handling not GET requests...
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Error 404: ' + req.method +
                ' not supported</h1></body></html>');
    }
})

server.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});