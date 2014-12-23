var nforce = require('nforce');
var express = require('express');
var app = express();
var path = require('path');
var oauth;
var USERNAME = "sangram@facebook.com";
var PASSWORD = "ilovejava@123BDGdFKCTZAEfBc9CBy0EBBWdV";

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

var org = nforce.createConnection({
  clientId: '3MVG9Y6d_Btp4xp5us8.2VCNA6VUfSef13I2MetrlsJUVNn_q.6ioiaKEJT0rftLUmHo76ZNZaqZBtxVdgle.',
  clientSecret: '4316823112659692181',
  redirectUri: 'https://radiant-meadow-4971.herokuapp.com/oauth/_callback'
});

function routeHandler() {
  app.get('/', function(req, res){
    console.log('Attempting to insert lead');
    var ld = nforce.createSObject('Lead', {
      FirstName: 'Max',
      LastName: 'Muller',
      Company: 'ABC Widgets',
      Email: 'max@muller.com'
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
