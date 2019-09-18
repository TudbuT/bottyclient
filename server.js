//PORT:
const port = 4000



const express = require('express');
const app = express();

const bot = require("./bot/main.js")


app.get('/', async function(req, re) {
  var r = req.query
  if(!r.path) {
    re.sendFile(__dirname + "/viewer/index.html")
  }
  if(r.path == "run" && r.token && !r.guild) {
    await bot.login(r.token)
    re.send(bot.selectGuild())
  }
  if(r.path == "sch" && r.guild) {
    re.send(bot.selectChannel(r.guild))
  }
  if(r.path == "msgs" && r.channel) {
    re.send(await bot.messages(r.channel))
    console.log(bot.messages(r.channel))
  }
  if(r.path == "send" && r.channel) {
    bot.send(r.channel, r.msg)
    re.send(bot.selectGuild())
  }
  if(r.path == "dm" && r.dm && r.msg) {
    bot.dm(r.dm, r.msg)
    re.send(bot.selectGuild())
  }
  if(r.path == "leave" && r.guild) {
    await bot.leave(r.guild)
    re.send(bot.selectGuild())
  }
  if(r.path == "delete" && r.channel) {
    bot.deletech(r.channel)
    re.send(bot.selectGuild())
  }
  if(r.path == "create" && r.name && r.type) {
    bot.create(r.name, {type: r.type}, r.guild)
    re.send(bot.selectGuild())
  }
  if(r.logoff == "1") {
    re.sendFile(__dirname + "/viewer/index.html")
    bot.logout()
  }
});

const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
