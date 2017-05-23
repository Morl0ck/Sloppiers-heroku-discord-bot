var http, director, cool, bot, router, server, port;
http        = require('http');
director    = require('director');
bot         = require('./bot.js');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login('MzE2MDM5MDg1OTkzMjMwMzM3.DAU1WA.KJYur8IUsLDCvz4mRUemSsaKK8c');

router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Hey, I'm Cool Guy.");
}

function getRocketLeagueUsers()
{
    var rl1 = client.channels.find('id', '93906010124603392').members.array().length;
    var rl2 = client.channels.find('id', '296821668029005845').members.array().length;

    return rl1 + rl2;
}