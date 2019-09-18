const express = require('express');
const app = express();

const bot = require("/app/bot/main.js")


app.get('/', async function(req, re) {
  var r = req.query
  if(!r.path) {
    re.sendFile("/app/viewer/index.html")
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
  if(r.logoff == "1") {
    await re.send('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><button type="button" onclick="window.location.href = `/`">LogIn (if this does\'nt work, try again in a few secounds)</button>')
    process.exit()
  }
});

const listener = app.listen(4000, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
