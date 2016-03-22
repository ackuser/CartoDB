var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

var express = require('express');
var app = express();

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/data', function (req, res) {
  // res.send(getData());
  var start = new Date()

  // var tmpFile = "/tmp/somefilename.doc";
  // var ws = fs.createWriteStream(tmpFile);
  getData(function(error,response){
    // console.log("Sending data")
    var body = '';
    response
    .setEncoding('utf8')
    .on('error', function(err) {
      console.error(err.stack);
    })
    .on('data', function(chunk) {
      body += chunk;
      // req.pipe(body)
      res.write(chunk);
    })
    .on('end', function() {
      // res.send(body)
      // res.writeHead(response.statusCode);
      res.end();
      var end = new Date() - start;
      console.info("Execution time: %ds", end / 1000);
      })
    //NOW I CAN PIPE
  });
});

var httpsServer = https.createServer(options, app);

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

// getData();
