var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request-json');
var mongoClient = require('mongodb').MongoClient;

var client = request.createClient('https://api2.autopilothq.com/');
client.headers["autopilotapikey"] = "6ad2dbded5cb44c19a5826784ba07889";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', (process.env.PORT || 5000));

app.post('/autopilot', function(req, res) {
    console.log(JSON.stringify(req.body, null, 4));
    var payload = {};
    //Twitter
    // if (req.body.email && req.body.screen_name && req.body.name) {
    //     console.log("Twitter post")
    //     payload = {
    //         "contact": { 
    //             "Email": req.body.email,
    //             "Twitter": req.body.screen_name,
    //             "FirstName": req.body.name
    //         }
    //     };  
    // }
    //Maitre New User
    if (req.body.list_uuid && req.body.response == "new_registration") {
        console.log("Maitre post");
        payload = {
            "contact": {
                "FirstName": req.body.name,
                "Email": req.body.email,
                "_autopilot_list": "contactlist_59B7CCF1-EA2F-4918-8B48-3A085CB9125B"       
            }
        }
    }
    //Maitre Accepted into Beta
    else if (req.body.list_uuid && req.body.response == "subscriber_accepted") {
        console.log("Maitre post");
        payload = {
            "contact": {
                "FirstName": req.body.name,
                "Email": req.body.email,                
                "_autopilot_list": "contactlist_A73207C3-05D3-4270-965B-9B19467F1AF8"       
            }
        }
        mongoClient.connect('mongodb://<dbuser>:<dbpassword>@ds021462.mlab.com:21462/rung-io', function(err,db) {
           db.collection('beta-request').insert(payload, function(err, result) {
               
           })
        });
    }
    if (payload.contact && payload.contact.Email) {
        mongoClient.connect('mongodb://<dbuser>:<dbpassword>@ds021462.mlab.com:21462/rung-io', function(err,db) {
           db.collection('beta-request').insert(payload, function(err, result) {
               if (!err) {
                    client.post('v1/contact', payload, function(err,httpResponse,body){ 
                        res.send("Added Maitre to autopilot");
                        res.end(); 
                    });   
               } else {
                   res.send("Didn't work");
                   res.end();
               }       
           })
        });        
           
    } else {
        res.send("Nothing done");
        res.end();
    }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


