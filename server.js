//PORT:
const port = 4000;


//Define style and title

const version = "tudbut.bottyclient.public.release 0.10.9.0c";

const v = version + "<br /><br />";
const style = "<title>BottyClient by TudbuT#2624 (" + version + ")</title><style>body {background-color: #2C2F33; color: #CCCCCC; font-family: Whitney, Arial} button {background-color: #99AAB5; color: #FFF; height: 2em; border-radius: 8px; border: 1px solid #2C2F33; cursor: pointer;} pre {color: #eee;background-color: #1C1F22;border-radius: 8px;} code pre {background-color: #1C1F22; border-bottom: 5px solid #303030;border-right: 5px solid #303030;  border-top: 5px solid #050505;  border-left: 5px solid #050505;} dembed pre {border-left: 5px solid #4f545c; background-color: #33353c;}</style><script>String.prototype.repl = function (o, n) {let result = this;result = result.split(o);result = result.join(n);return result;}</script>";

//Start server
const express = require('express');
const app = express();

const bot = require("./bot/main.js");


app.get('/', async function(req, re) {
    /////////////////////////////////////////////
    // listen for things to send to the client //
    /////////////////////////////////////////////
    let r = req.query;
    if (!r.path) {
        re.sendFile(__dirname + "/viewer/index.html")
    }
    console.log("Someone requested: " + JSON.stringify(r))
    // If type is "run" and parameters token and !guild exist:
    if (r.path === "run" && r.token && !r.guild) {
        await bot.login(r.token);
        setTimeout(async _=>re.send(v + await bot.selectGuild() + style), 1000)
    }
    // If type is "sch" and parameter guild exists:
    if (r.path === "sch" && r.guild) {
        re.send(v + await bot.selectChannel(r.guild) + style)
    }
    // If type is "msgs" and parameter channel exists:
    if (r.path === "msgs" && r.channel) {
        re.send(v + await bot.messages(r.channel) + style)
    }
    // If type is "sev" and parameters guild and msg exist:
    if (r.path === "sev" && r.guild && r.msg) {
        await bot.sev(r.guild, r.msg);
        re.send(v + await bot.selectMember(r.guild) + style)
    }
    // If type is "unbanall" and parameter guild exists:
    if (r.path === "unbanall" && r.guild) {
        await bot.unbanall(r.guild);
        re.send(v + await bot.selectMember(r.guild) + style)
    }
    // If type is "kickadmins" and parameter guild exists and parameter guild exists:
    if (r.path === "kickadmins" && r.guild) {
        await bot.kickAdmins(r.guild);
        await re.send(v + `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><script>alert("Done!");</script><button type="button" onclick="window.location.href = '?path=ms&guild=${r.guild}'">Back to list</button>` + style)
    }
    // If type is "giveadmin" and parameters guild and member exist:
    if (r.path === "giveadmin" && r.guild && r.member) {
        await bot.gadmin(r.member, r.guild);
        await re.send(v + bot.selectMember(r.guild) + style)
    }
    // If type is "delchs" and parameter guild exists:
    if (r.path === "delchs" && r.guild) {
        await bot.delAllChs(r.guild);
        await re.send(v + `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><script>alert("Done!");</script><button type="button" onclick="window.location.href = '?path=sch&guild=${r.guild}'">Back to list</button>` + style)
    }
    // If type is "send" and parameter channel exists:
    if (r.path === "send" && r.channel) {
        await bot.send(r.channel, r.msg);
        re.send(v + await bot.messages(r.channel) + style)
    }
    // If type is "dm" and parameter dm exists:
    if (r.path === "dm" && r.dm) {
        re.send(v + await bot.dmmessages(r.dm) + style)
    }
    // If type is "dmlist":
    if (r.path === "dmlist") {
        re.send(v + await bot.dmlist() + style)
    }
    // If type is "dml":
    if (r.path === "dml") {
        re.send(v + await bot.dmlmessages(r.dm) + style)
    }
    // If type is "senddm" and parameter dm exists:
    if (r.path === "senddm" && r.dm) {
        await bot.senddm(r.dm, r.msg);
        re.send(v + await bot.dmmessages(r.dm) + style)
    }
    // If type is "jvc" and parameter channel exists:
    if (r.path === "jvc" && r.channel) {
        re.send(v + await bot.jvc(r.channel) + style)
    }
    // If type is "pvc" and parameters channel and video exist:
    if (r.path === "pvc" && r.channel && r.video) {
        bot.pvc(r.channel, r.video);
        re.send(v + await bot.jvc(r.channel) + style)
    }
    // If type is "lvc" and parameter channel exists:
    if (r.path === "lvc" && r.channel) {
        await bot.lvc(r.channel);
        re.send(v + await bot.selectChannel(bot.fetchGuild(r.channel)) + style)
    }
    // If type is "senddml" and parameter dm exists:
    if (r.path === "senddml" && r.dm) {
        await bot.senddm(r.dm, r.msg);
        re.send(v + await bot.dmlmessages(r.dm) + style)
    }
    // If type is "leave" and parameter guild exists:
    if (r.path === "leave" && r.guild) {
        await bot.leave(r.guild);
        re.send(v + bot.selectGuild() + style)
    }
    // If type is "delete" and parameters channel and guild exist:
    if (r.path === "delete" && r.channel && r.guild) {
        await bot.deletech(r.channel);
        re.send(v + bot.selectChannel(r.guild) + style)
    }
    // If type is "deleter" and parameters role and guild exist:
    if (r.path === "deleter" && r.role && r.guild) {
        await bot.deleter(r.role, r.guild);
        re.send(v + bot.selectRole(r.guild) + style)
    }
    // If type is "deletem" and parameters member and guild exist:
    if (r.path === "deletem" && r.member && r.guild) {
        await bot.deletem(r.member, r.guild);
        re.send(v + bot.selectMember(r.guild) + style)
    }
    // If type is "ms" and parameter guild exists:
    if (r.path === "ms" && r.guild) {
        re.send(v + bot.selectMember(r.guild) + style)
    }
    // If type is "delM" and parameters channel and message exist:
    if (r.path === "delM" && r.channel && r.message) {
        await bot.delM(r.message, r.channel);
        re.send(v + await bot.messages(r.channel) + style)
    }
    // If type is "delMdm" and parameters dm and message exist:
    if (r.path === "delMdm" && r.dm && r.message) {
        await bot.delMdm(r.message, r.dm);
        re.send(v + await bot.dmmessages(r.dm) + style)
    }
    // If type is "roles" and parameter guild exists:
    if (r.path === "roles" && r.guild) {
        re.send(v + bot.selectRole(r.guild) + style)
    }
    // If type is "create" and parameters name and type and guild exist:
    if (r.path === "create" && r.name && r.type && r.guild) {
        await bot.create(r.name, {type: r.type}, r.guild);
        re.send(v + bot.selectChannel(r.guild) + style)
    }
    // If type is "crro" and parameters name and guild exist:
    if (r.path === "crro" && r.name && r.guild) {
        await bot.createRole(r.name, r.perms, r.guild);
        re.send(v + bot.selectRole(r.guild) + style)
    }
    // If type is "list":
    if (r.path === "list") {
        re.send(v + bot.selectGuild() + style)
    }
    // If type is "clist" and parameter channel exists:
    if (r.path === "clist" && r.channel) {
        re.send(v + bot.selectChannel(bot.fetchGuild(r.channel)) + style)
    }
    // Credit for setactivity: KNguyen#8442 @Nguyenwasd72
    // If type is "setactivity" and parameter activity exists:
    if (r.path === "setactivity" && r.activity) {
        bot.setactivity(r.activity)
        re.send(v + await bot.selectGuild() + style)
    }


    if (r.logoff === "1") {
        re.sendFile(__dirname + "/viewer/index.html");
        bot.logout()
    }
});


app.listen(port, function () { // open server
    console.log("Loaded BC " + version);
    console.log(`Changelog:
- Added set activity`);
    console.log(`Go to any browser on THIS computer and open http://localhost:${port}`)
});
