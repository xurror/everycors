var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");    
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('target-url');
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        var headers = {}
        if(req.header('WebApiAuthTicket')) headers['WebApiAuthTicket'] = req.header('WebApiAuthTicket');
        if(req.header('deviceId')) headers['deviceId'] = req.header('deviceId');
        if(req.header('deviceType')) headers['deviceType'] = req.header('deviceType');
        if(req.header('userName')) headers['userName'] = req.header('userName');
        if(req.header('password')) headers['password'] = req.header('password');
        if(req.header('Accept')) headers['Accept'] = req.header('Accept');        
        if(req.header('Content-Type')) headers['Content-Type'] = req.header('Content-Type');        
        if(req.header('webapiauthticket')) headers['WebApiAuthTicket'] = req.header('webapiauthticket');
        if(req.header('accept')) headers['Accept'] = req.header('accept');        
        if(req.header('content-type')) headers['Content-Type'] = req.header('content-type');        
        request({ url: targetURL + req.url, method: req.method, json: req.body, headers: headers},
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
//                console.log(body);
            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
