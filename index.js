
var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();

var options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

var httpsServer = https.createServer(options, app);
var io = require('socket.io')(httpsServer);

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Pass to next layer of middleware
  next();
});

app.use("/app.js", express.static(__dirname + '/client/app.js'));
app.use("/style.css", express.static(__dirname + '/client/style.css'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

io
.on('connection', function (socket) {
  socket.on('message', function(msg){
    console.log("Hello Socketio " + msg)
  });
})

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
      // req.pipe(body)
      res.write(chunk);
      // io.emit('svg', chunk)
      // debugger
      //  chunk.substring(chunk.length -10 , chunk.length)
      body = processChunkSvg(body,first)
      first = false;
    })
    .on('end', function() {
      // res.send(body)
      // res.writeHead(response.statusCode);
      // processChunkSvgEnd()
      res.end();
      var end = new Date() - start;
      console.info("Execution time: %ds", end / 1000);
    })
  });
});

httpsServer.listen(3000, function () {
  console.log("server running at https://localhost:3000/")
});

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

//MARCAR ALGUN THROW & ERRORS!!!
function processChunkSvg(chunk,first) {
  // debugger
  var path = chunk.substring(0,5) == "<path" ? true : false
  var elementsSvg = chunk.split("<path");
  var restChunk = ''
  // console.log("|" + chunk + "|");
  if(first){
    restChunk = processChunkSvgHeader(elementsSvg)
  }
  else if (!checkIfPath(elementsSvg,path)) {
    // console.info("MAS DE 1");
    restChunk = processChunkSvgElement(elementsSvg);
    // if (restChunk.toString().indexOf("</svg>")) {
      debugger
      // console.log(restChunk);
      // console.log(restChunk.substring(restChunk.length - 4,restChunk.length))
    // }
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

function processChunkSvgHeader(elementsSvg) {
  var header = elementsSvg.shift()
  console.log(header);
  // io.emit('svg', header)
  return "<path" + elementsSvg[0]
}

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

function processChunkSvgEnd() {
  io.emit('svg', '</svg>')
}

function checkIfPath(elementsSvg,path) {
  return elementsSvg.length == 2 && path && elementsSvg[0] == ''
}
