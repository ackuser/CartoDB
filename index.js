
var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();

// HTTPS
var options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

var httpsServer = https.createServer(options, app);
var io = require('socket.io')(httpsServer);

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Static Files
app.use("/app.js", express.static(__dirname + '/client/app.js'));
app.use("/style.css", express.static(__dirname + '/client/style.css'));
app.use("/jquery.min.js", express.static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use("/jquery.panzoom.min.js", express.static(__dirname + '/bower_components/jquery.panzoom/dist/jquery.panzoom.min.js'));
app.use("/angular.min.js", express.static(__dirname + '/bower_components/angular/angular.min.js'));
app.use("/bootstrap.min.css", express.static(__dirname + '/bower_components/bootstrap/dist/css/bootstrap.min.css'));
app.use("/socket.io.js", express.static(__dirname + '/node_modules/socket.io-client/socket.io.js'));

// Index Files
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

// Route data to retrieve dataset
app.get('/data', function (req, res) {
  var start = new Date()
  io
  .emit('welcome', { message: 'Welcome!' });
  getData(function(error,response){
    var body = '',
    first = true;

    response
    .setEncoding('utf8')
    .on('error', function(err) {
      console.error(err.stack);
    })
    .on('data', function(chunk) {
      body += chunk;
      try {
        body = processChunkSvg(body,first)
      } catch (err) {
        console.error("Something was wrong with the parsing " + err)
      }
      first = false;
    })
    .on('end', function() {
      res.end();
      var end = new Date() - start;
      console.info("Execution time for processing all the entiere dataset: %ds", end / 1000);
    })
  });
});

// Server listening
httpsServer.listen(3000, function () {
  console.log("server running at https://localhost:3000/")
});

// API Request
function getData(callback) {

  return https.get({
    host: 'rambo-test.cartodb.com',
    port: 443,
    path: '/api/v2/sql?format=SVG&q=select%20*%20from%20public.mnmappluto'
    // path: '/api/v2/sql?format=SVG&q=select%20*%20from%20public.north_america_adm0'
  }, function(response) {
    callback(null, response);
  })
}

// Parsing svg data
function processChunkSvg(chunk,first) {
  // debugger
  var path = chunk.substring(0,5) == "<path" ? true : false
  var elementsSvg = chunk.split("<path");
  var restChunk = ''
  if(first){
    restChunk = processChunkSvgHeader(elementsSvg)
  }
  else if (!checkIfPath(elementsSvg,path)) {
    restChunk = processChunkSvgElement(elementsSvg);
  }
  else if (checkIfPath(elementsSvg,path)) {
    var path = '<path' + elementsSvg[1]
    restChunk = path
  }
  else if (!checkIfPath(elementsSvg,path)) {
    var content = elementsSvg[1]
    restChunk = content
  }
  return restChunk
}

// Parsing svg header
function processChunkSvgHeader(elementsSvg) {
  var header = elementsSvg.shift()
  // console.log(header);
  // io.emit('svg', header)
  return "<path" + elementsSvg[0]
}

// Parsing svg tags
function processChunkSvgElement(elementsSvg) {
  elementsSvg.shift()
  var length = elementsSvg.length
  var last = elementsSvg.slice(length - 1, length)
  elementsSvg[0] = '<path' + elementsSvg[0]
  var content = elementsSvg.slice(0,length - 1).join('<path')
  // console.log(content)
  io.emit('svg', content)
  return '<path' + last
}

// Ending up svg
function processChunkSvgEnd() {
  io.emit('svg', '</svg>')
}

// Check if it is an element in svg
function checkIfPath(elementsSvg,path) {
  return elementsSvg.length == 2 && path && elementsSvg[0] == ''
}
