var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/data', function (req, res) {
  // res.send(getData());
  getData(function(data){
    console.log(data)
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
    path: '/api/v2/sql?q=select%20*%20from%20public.north_america_adm0'
  }, function(response) {
    // Continuously update stream with data
    var body = '';
    response
    .setEncoding('utf8')
    .on('error', function(err) {
      console.error(err.stack);
    })
    .on('data', function(d) {
      body += d;
      // res.pipe(d);
      // console.log(d.toString())

    })
    .on('end', function() {
      // Data reception is done, do whatever with it!
      // var parsed = JSON.parse(body);
      // console.log(JSON.stringify(parsed, null, 4));
      callback(body);
      // req.result = body
    })

  })//.end();
  // console.log(req)
}

// getData();
