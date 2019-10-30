//PORT:
const port = 4000


//Define style and title
const version = "tudbut.bottyclient.public.release 0.10.2.1h"
const v = version + "<br /><br />"
const style = "<title>BottyClient by TudbuT#2624 (" + version + ")</title><style>body {background-color: #2C2F33; color: #CCCCCC; font-family: Whitney, Arial} button {background-color: #99AAB5; color: #FFF; height: 2em; border-radius: 8px; border: 1px solid #2C2F33; cursor: pointer;} pre {color: #eee;background-color: #1C1F22;border-radius: 8px;} code pre {background-color: #1C1F22; border-bottom: 5px solid #303030;border-right: 5px solid #303030;  border-top: 5px solid #050505;  border-left: 5px solid #050505;} dembed pre {border-left: 5px solid #4f545c; background-color: #33353c;}</style>"

//Start server
const express = require('express');
const app = express();

const bot = require("./bot/main.js")


app.get('/', async function(req, re) {
  /////////////////////////////////////////////
  // listen for things to send to the client //
  /////////////////////////////////////////////
  var r = req.query
  if(!r.path) {
    re.sendFile(__dirname + "/viewer/index.html")
  }
  if(r.path == "run" && r.token && !r.guild) {
    await bot.login(r.token)
    re.send(v + await bot.selectGuild() + style)
  }
  if(r.path == "sch" && r.guild) {
    re.send(v + await bot.selectChannel(r.guild) + style)
  }
  if(r.path == "msgs" && r.channel) {
    re.send(v + await bot.messages(r.channel) + style)
  }
  if(r.path == "kickadmins" && r.guild) {
    const run = async function (rx) { 
      await bot.kickAdmins(r.guild)
      return ""
    }
    re.send(v + await bot.selectMember(r.guild) + style)
  }
  if(r.path == "delchs" && r.guild) {
    const run = async function (rx) {
      await bot.delAllChs(rx.guild)
      return ""
    }
    await run(r)
    await re.send(v + await bot.selectChannel(r.guild) + style)
  }
  if(r.path == "send" && r.channel) {
    await bot.send(r.channel, r.msg)
    re.send(v + await bot.messages(r.channel) + style)
  }
  if(r.path == "dm" && r.dm) {
    re.send(v + await bot.dmmessages(r.dm) + style)
  }
  if(r.path == "dmlist") {
    re.send(v + await bot.dmlist() + style)
  }
  if(r.path == "dml") {
    re.send(v + await bot.dmlmessages(r.dm) + style)
  }
  if(r.path == "senddm" && r.dm) {
    await bot.senddm(r.dm, r.msg)
    re.send(v + await bot.dmmessages(r.dm) + style)
  }
  if(r.path == "jvc" && r.channel) {
    re.send(v + await bot.jvc(r.channel) + style)
  }
  if(r.path == "pvc" && r.channel && r.video) {
    bot.pvc(r.channel, r.video)
    re.send(v + await bot.jvc(r.channel) + style)
  }
  if(r.path == "lvc" && r.channel) {
    await bot.lvc(r.channel)
    re.send(v + await bot.selectChannel(bot.fetchGuild(r.channel)) + style)
  }
  if(r.path == "senddml" && r.dm) {
    await bot.senddm(r.dm, r.msg)
    re.send(v + await bot.dmlmessages(r.dm) + style)
  }
  if(r.path == "leave" && r.guild) {
    await bot.leave(r.guild)
    re.send(v + bot.selectGuild() + style)
  }
  if(r.path == "delete" && r.channel && r.guild) {
    await bot.deletech(r.channel)
    re.send(v + bot.selectChannel(r.guild) + style)
  }
  if(r.path == "deleter" && r.role && r.guild) {
    await bot.deleter(r.role, r.guild)
    re.send(v + bot.selectRole(r.guild) + style)
  }
  if(r.path == "deletem" && r.member && r.guild) {
    await bot.deletem(r.member, r.guild)
    re.send(v + bot.selectMember(r.guild) + style)
  }
  if(r.path == "ms" && r.guild) {
    re.send(v + bot.selectMember(r.guild) + style)
  }
  if(r.path == "delM" && r.channel && r.message) {
    await bot.delM(r.message, r.channel)
    re.send(v + await bot.messages(r.channel) + style)
  }
  if(r.path == "delMdm" && r.dm && r.message) {
    await bot.delMdm(r.message, r.dm)
    re.send(v + await bot.dmmessages(r.dm) + style)
  }
  if(r.path == "roles" && r.guild) {
    re.send(v + bot.selectRole(r.guild) + style)
  }
  if(r.path == "create" && r.name && r.type && r.guild) {
    await bot.create(r.name, {type: r.type}, r.guild)
    re.send(v + bot.selectChannel(r.guild) + style)
  }
  if(r.path == "crro" && r.name && r.guild) {
    await bot.createRole(r.name, r.perms, r.guild)
    re.send(v + bot.selectRole(r.guild) + style)
  }
  if(r.path == "list") {
    re.send(v + bot.selectGuild() + style)
  }
  if(r.path == "clist" && r.channel) {
    re.send(v + bot.selectChannel(bot.fetchGuild(r.channel)) + style)
  }
  if(r.logoff == "1") {
    re.sendFile(__dirname + "/viewer/index.html")
    bot.logout()
  }
});

const listener = app.listen(port, function() { // open server
  console.log(`Go to any browser on THIS computer and open http://localhost:${port}`)
})
