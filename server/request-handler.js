
var fs = require('fs');
var url = require('url')

var objectId = 1;

var messages = [];

fs.readFile('./messages.dat', function(err, data) {
  if (data && !err) {
    messageStorage = JSON.parse(data);
    console.log("Messages loaded.");
  }
})

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);



  headers['Content-Type'] = "application/json";

  if(request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    response.end();
  };

  if(request.url === '/classes/messages' || request.url === '/classes/room1') {

    if (request.method === 'POST') {
      request.on('data', function(data) {
        messageStorage.push(JSON.parse(data));
        
        fs.writeFile('./messages.dat', JSON.stringify(messageStorage), function(err) {
          err && console.log(err);
          console.log('Messages saved.')
        });
      })
      response.writeHead(201, headers);
      response.end(JSON.stringify({ status: 201, success: "Message posted." }));
    }

    if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify({ results: messageStorage }));
    }

  } else {

    if(request.url === '/') {

      fs.readFile('./../client/index.html', function(error, data) {
        headers['Content-Type'] = "text/html";
        response.writeHead(200, headers);
        response.write(data);
        response.end();
      });
    } else {

      fs.readFile('./../client/indexJQuery.html' + request.url, function(error, data) {

        if (error) {
          response.writeHead(404, headers);
          response.end();
        } else {
          headers['Content-Type'] = request.url.slice(-3) === "css" ? "text/css" : "text/javascript";
          response.writeHead(200, headers);
          response.write(data);
          response.end();
        }
      });
    }
  }

};

exports.requestHandler = requestHandler;




var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

