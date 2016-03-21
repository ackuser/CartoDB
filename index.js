var https = require('https');

function getData(callback) {

    return https.get({
        host: 'rambo-test.cartodb.com',
        port: 443,
        path: '/api/v2/sql?q=select%20*%20from%20public.north_america_adm0'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
            // console.log(d.toString())
        });
        response.on('end', function() {
            // console.log(body);
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            console.log(JSON.stringify(parsed, null, 4));

            // callback({
            //     email: parsed.email,
            //     password: parsed.pass
            // });
        });
    });

}

 getData();
