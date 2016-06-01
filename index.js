var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request-json');

var client = request.createClient('https://api2.autopilothq.com/');
client.headers["autopilotapikey"] = "9cad0606bc1e4215b098389e15b8a4cb";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', (process.env.PORT || 5000));

app.post('/autopilot', function(req, res) {
    console.log(JSON.stringify(req.bodyk, null, 4));
    var payload = {};
    //Twitter
    if (req.body.email && req.body.screen_name && req.body.name) {
        payload = {
            "contact": { 
                "Email": req.body.email,
                "Twitter": req.body.screen_name,
                "FirstName": req.body.name
            }
        };  
    }
    //Maitre 
    else if (req.body.list_uuid && req.body.response == "new_registration") {
        payload = {
            "contact": {
                "Email": req.body.email                
            }
        }
    }
    if (payload.Email) {        
        client.post('v1/contact', payload, function(err,httpResponse,body){ 
            res.send(body); 
        });   
    }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


