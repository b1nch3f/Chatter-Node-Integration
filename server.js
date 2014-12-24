var nforce = require('nforce'),
    chatter = require('nforce-chatter')(nforce);
var express = require('express');
var app = express();
var path = require('path');
var oauth;
var USERNAME = "sangram@facebook.com";
var PASSWORD = "ilovejava@123BDGdFKCTZAEfBc9CBy0EBBWdV";

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

var org = nforce.createConnection({
    clientId: '3MVG9Y6d_Btp4xp5us8.2VCNA6VUfSef13I2M32FGrhjIHTjLyu0BVyCJi8Htv0QgP55b4Yozjd4KOKT1X7W_',
    clientSecret: '6936064785633313339',
    redirectUri: 'http://localhost:3000/oauth/_callback',
    apiVersion: 'v32.0',  // optional, defaults to current salesforce API version
    environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
    mode: 'multi', // optional, 'single' or 'multi' user mode, multi default
    plugins: ['chatter']
});

function routeHandler() {
    app.get('/createlead', function(req, res){
        console.log('Attempting to insert lead');
        var ld = nforce.createSObject('Lead', {
            FirstName: req.query.firstname,
            LastName: req.query.lastname,
            Company: req.query.company,
            Email: req.query.email
        });
        org.insert({ sobject: ld, oauth: oauth }, function(err, resp) {
            if(err) {
                console.error('--> unable to insert lead');
                console.error('--> ' + JSON.stringify(err));
            } else {
                console.log('--> lead inserted');
                res.send('Lead inserted');
            }
        });
    }).get('/getfeed', function(request, response) {
        org.chatter.recordFeed({id: 'a029000000O82e0', oauth: oauth}, function(err, resp) {
            if (!err) {
                console.log(resp);
                response.json(resp);
            }
            if (err) console.log(err);
        });
    }).get('/postfeed', function(request, response) {
        org.chatter.postFeedItem({id: 'a029000000O82e0', text: request.query.text, oauth: oauth}, function(err, resp) {
            if (!err) {
                console.log(resp);
                response.json('success');
            }
            if (err) console.log(err);
        });
    }).get('/', function(req, res){
        res.sendfile(__dirname + '/index.html')
    });
}

console.log('Authenticating with Salesforce');

org.authenticate({ username: USERNAME, password: PASSWORD }, function(err, resp) {
    if(err) {
        console.error('--> unable to authenticate to sfdc');
        console.error('--> ' + JSON.stringify(err));
    } else {
        console.log('--> authenticated!');
        oauth = resp;
        routeHandler();
    }
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
