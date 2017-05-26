var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var botID = process.env.BOT_ID || "24051ae9fb10a5321d454950f5";

var indexClient = null;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/,
      rocketLeagueRegex = /(rl|rocket league)\s?(anyone)?.*\??/i;

  console.log(request);
  if (request.sender_type == "bot") return;

  if (request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    var botResponse = cool();
    postMessage(botResponse);
    this.res.end();
  } else if (request.text && rocketLeagueRegex.test(request.text)) {
    this.res.writeHead(200);
    var botResponse = "Number of people in the rocket league channels: " + getRocketLeagueUsers();
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
  var members = "";
  var memberArray1 = indexClient.channels.find('id', '93906010124603392').members.array();

  for (var i = 0; i < memberArray1.length; i++) {
    members += "\n" + memberArray1[i].user.username;
  };

  var memberArray2 = indexClient.channels.find('id', '296821668029005845').members.array();

  for (var i = 0; i < memberArray2.length; i++) {
    members += "\n" + memberArray2[i].user.username;
  };

  return memberArray1.length + memberArray2.length + members;
}

function setClient(client){
  indexClient = client;
  console.log('client set!');

  console.log('rocket league users', getRocketLeagueUsers());
}

exports.setClient = setClient;
exports.respond = respond;
