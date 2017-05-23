var HTTPS = require('https');
var index = require('./index.js');
var botID = process.env.BOT_ID;

var indexClient = null;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      rocketLeagueRegex = /(rl|rocket league)\s?(anyone)?.*\??/i;

  if(request.text && rocketLeagueRegex.test(request.text)) {
    this.res.writeHead(200);
    var botResponse = index.getRocketLeagueUsers();
    postMessage(botResponse);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}


function postMessage(botResponse) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function getRocketLeagueUsers()
{
    var rl1 = indexClient.channels.find('id', '93906010124603392').members.array().length;
    var rl2 = indexClient.channels.find('id', '296821668029005845').members.array().length;

    return rl1 + rl2;
}

exports.client = indexClient;
exports.respond = respond;