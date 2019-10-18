const Discord = require("discord.js")
var client = new Discord.Client()
const starter = require("../addons/starter.js")
var remote = "<br />NO MESSAGES FOUND"
global.inv = "<br />NO INVITE FOUND"


var cmdr = ""
var loggedin = new Boolean(false)
module.exports = {
  ///////////////////////////////////////////////
  // Where the client listens for things to do //
  ///////////////////////////////////////////////
  login: async function (token) {
    await client.login(token)
    loggedin = true
    return
  },
  logout: function () {
    client.destroy()
    const c2 = new Discord.Client()
    client = c2
  },
  selectGuild: function(){
    var selg = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Reload</button><br />" + client.user.tag + "<br /><h1>Select Guild</h1><br /><button type=\"button\" onclick=\"window.location.href = `?path=dm&dm=${prompt('UserID:')}`\">DM</button><br /><button type=\"button\" onclick=\"window.location.href = `?path=dmlist`\">DMlist</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><br /><br />" + client.guilds.size + "<br />")
    client.guilds.forEach(g => {
      selg = selg + `<br /><button type="button" onclick="window.location.href = '?path=sch&guild=${g.id}'">${g.name.replace("<", "&lt;")}</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selg + `<br /><br /><button type="button" onclick="window.location.href = '${starter.dsctools().getInvite(client)}'">GetInvite</button>`
  },
  selectChannel: function(g){
    var selc = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') == 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Select Channel</h1>" + client.guilds.get(g).channels.size + "<br />")
    client.guilds.get(g).channels.forEach(c => {
      if(c.type == 'text') selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=msgs&channel=${c.id}'">[#]${c.name.replace("<", "&lt;")}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
      else if(c.type == 'category') selc = selc + `<br />[+]${c.name.replace("<", "&lt;")}<button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
      else if(c.type == 'voice') selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=jvc&channel=${c.id}'">[\<]${c.name.replace("<", "&lt;")}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selc + '<br /><br /><button type="button" onclick="window.location.href = `?path=create&type=text&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create TextChannel</button><button type="button" onclick="window.location.href = `?path=create&type=voice&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create VoiceChannel</button>'
  },
  selectRole: function(g){
    var selr = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') == 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Roles</h1>" + client.guilds.get(g).roles.size + "<br />")
    client.guilds.get(g).roles.forEach(r => {
      selr = selr + `<br />${r.name.replace("<", "&lt;")}<button type="button" onclick="window.location.href = '?path=deleter&role=${r.id}&guild=${g}'">Delete</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selr + `<br /><br /><button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').replace('#', '%23').replace('&', '%26') + '&perms=' + prompt('Permission (can be empty):')">Create</button>` //+ `<button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').replace('#', '%23').replace('&', '%26') + '&perms=ADMINISTRATOR">Create ADMIN</button>`
  },
  selectMember: function(g){
    var selm = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') == 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Members</h1>" + client.guilds.get(g).members.size + "<br />")
    client.guilds.get(g).members.forEach(m => {
      if(m) {
        var isBot = ""
        if(m.user.bot) isBot = "[BOT]"
        var isOwner = ""
        if(!m.guild.owner) console.error("This guild has no owner")
        else if(m.user.id == m.guild.owner.user.id) isOwner = "[OWNER]"
        selm = selm + `<br /><button type="button" onclick="window.location.href = '?path=dml&dm=${m.user.id}'">${m.user.tag.replace("<", "&lt;")}${isBot}${isOwner}</button><button type="button" onclick="window.location.href = '?path=deletem&member=${m.user.id}&guild=${g}'">Delete</button>`
      }
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selm
  },
  jvc: async function (channel) {
    client.channels.find(c => c.id == channel).join()
    var ht = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">")
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=lvc&channel=" + channel + "\`\">Leave</button><script>var x = function () {return prompt('YT-Link:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button><br></br><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=${x()}`\">Play Video</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=mc`\">Play MC</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=njoy`\">Play Radio (Germany / N-JOY)</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=ggr`\">Play Radio (GGradio)</button>"
    await wait()
    return ht
  },
  pvc: async function (channel, video) {
    await client.channels.find(c => c.id == channel).leave()
    play(channel, video)
    async function play(channel, video) {
    var c = await client.channels.find(c => c.id == channel).join()
    const ytdl = require("ytdl-core")
    var cc
    if(video == "ggr") {
      if(c.play) cc = c.play("https://api.tmw.media/ggradio/stream")
      if(c.playStream) cc = c.playStream("https://api.tmw.media/ggradio/stream")
      cc.setVolume(0.24)
    } else if(video == "njoy") {
      if(c.play) cc = c.play("https://ndr-njoy-live.sslcast.addradio.de/ndr/njoy/live/mp3/128/stream.mp3")
      if(c.playStream) cc = c.playStream("https://ndr-njoy-live.sslcast.addradio.de/ndr/njoy/live/mp3/128/stream.mp3")
      cc.setVolume(0.3)
    } else if(video == "mc") {
      if(c.play) cc = c.play("http://stream.laut.fm/minecraft-soundtrack")
      if(c.playStream) cc = c.playStream("http://stream.laut.fm/minecraft-soundtrack")
      cc.setVolume(0.4)
    } else if(video != "mc" && video != "radio") {
      if(c.play) cc = c.play(ytdl(video, {filter: 'audioonly'}))
      if(c.playStream) cc = c.playStream(ytdl(video, {filter: 'audioonly'}))
      cc.setVolume(0.06)
    }
    cc.on('end', async () => {
      cc.destroy()
      play(channel, video)
    })
    cc.on('finish', async () => {
      cc.destroy()
      play(channel, video)
    })
    }
  },
  lvc: function (channel) {
    client.channels.find(c => c.id == channel).leave()
  },
  dmlist: function(){
    var selm = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Users</h1>" + client.users.size + "<br />")
    client.users.forEach(m => {
      if(m) {
        var isBot = ""
        if(m.bot) isBot = "[BOT]"
        selm = selm + `<br /><button type="button" onclick="window.location.href = '?path=dml&dm=${m.id}'">${m.tag.replace("<", "&lt;")}${isBot}</button>`
      }
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selm
  },
  messages: async function(channel) {
    remote = "<br />ERR 2 (NO MESSAGES FOUND)"
    var ht = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">")
    await gms(channel)
    var msgs = remote
    if(client.user.bot) {
      await client.channels.find(c => c.id == channel).createInvite({}).then(async invite => {
        global.inv = await invite.url
      })
    }
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=send&channel=" + channel + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=msgs&channel=" + channel + "\`\">Reload</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button>" + "<br /><br />" + await global.inv + msgs
    await wait()
    cmdr = ""
    return ht
  },
  dmmessages: async function(dm) {
    remote = "<br />ERR 2 (NO MESSAGES FOUND)"
    var ht = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">")
    await dmgms(dm)
    var msgs = remote
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=senddm&dm=" + dm + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=dm&dm=" + dm + "\`\">Reload</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button>" + cmdr + msgs
    await wait()
    cmdr = ""
    return ht
  },
  dmlmessages: async function(dm) {
    remote = "<br />ERR 2 (NO MESSAGES FOUND)"
    var ht = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">")
    await dmgms(dm)
    var msgs = remote
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=senddml&dm=" + dm + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=dml&dm=" + dm + "\`\">Reload</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=dmlist'\">Back to list</button>" + cmdr + msgs
    await wait()
    cmdr = ""
    return ht
  },
  delM: async function(message, channel) {
    await client.channels.find(c => c.id == channel).fetchMessages({limit: 100}).then(m => m.find(_m => _m.id == message).delete(50))
    return await wait()
  },
  delMdm: async function(message, dm) {
    await client.users.find(u => u.id == dm).createDM().then(c => c.fetchMessages({limit: 100}).then(m => m.find(_m => _m.id == message).delete(50)))
    return await wait()
  },
  send: async function (channel, msg) {
    await client.channels.find(c => c.id == channel).send(msg)
    console.log("Sent")
    return await wait()
  },
  senddm: async function (dm, msg) {
    var send = 1
    cmdr = ""
    if(msg.startsWith("/bc")) send = 0;
    if(msg == "/bc.i") cmdr = `<br />ID: <pre>${dm}</pre><br />Tag: <pre>${await client.users.find(u => u.id == dm).tag}</pre>`;
    if(msg == "/bc.help") cmdr = `<br /><code><pre>
Commands:
"/bc.i" - Shows user info
"/bc.help" - Shows command list
</pre></code>`
    if(send == 1) await client.users.find(u => u.id == dm).send(msg)
    console.log("Sent DM")
    return await wait()
  },
  leave: async function (guild) {
    await client.guilds.find(g => g.id == guild).leave()
    return
  },
  deletech: async function(channel) {
    await client.channels.find(c => c.id == channel).delete()
    return
  },
  deleter: async function(role, guild) {
    await client.guilds.find(g => g.id == guild).roles.find(r => r.id == role).delete()
    return
  },
  deletem: async function(member, guild) {
    await client.guilds.find(g => g.id == guild).members.find(m => m.id == member).kick()
    return
  },
  create: async function (name, data, guild) {
    await client.guilds.find(g => g.id == guild).createChannel(name, data)
    return
  },
  createRole: async function (name, perms, guild) {
    if(perms == "" || !perms) {
      await client.guilds.find(g => g.id == guild).createRole({
        name: name
      })
    } else await client.guilds.find(g => g.id == guild).createRole({name: name, permissions: perms.toUpperCase()})
    return
  },
  fetchGuild: function(channel) {
    return client.channels.find(c => c.id == channel).guild.id
  }
}

client.on('ready', () => {
  console.log("Ready.")
})

async function gms (channel) { // return list of messages
      var x = "<br /><br /><br />Messages: <br /><br />"
      await client.channels.find(c => c.id == channel).fetchMessages({limit: 50}).then(async ms => {
        await ms.forEach(m => {
          var embeds = ""
          if(m.embeds && m.embeds[0]) {
            var d = ""
            if(m.embeds[0].description) d = m.embeds[0].description.replace("<", "&lt;");
            var t = ""
            if(m.embeds[0].title) t = m.embeds[0].title.replace("<", "&lt;");
            var ma = maut(m);
            embeds = `<dembed> <pre>${ma}[T]${t}

${d}

[FIELDS AREN'T SUPPORTED YET]
</pre> </dembed>`
          }
          x = x + "<br /><br />" + m.author.tag + " -- " + m.content.replace("\n", "<br />") + embeds + `<button type="button" onclick="window.location.href = '?path=delM&channel=${channel}&message=${m.id}'">Delete</button>`
          remote = x
        })
        if(remote) {
          await wait()
        }
        return remote
      })
    }
async function dmgms (dm) { // return list of dm messages
      var x = "<br /><br /><br />Messages: <br /><br />"
      await client.users.find(u => u.id == dm).createDM().then(async c => {
      await c.fetchMessages({limit: 50}).then(async ms => {
        await ms.forEach(m => {
          var embeds = ""
          if(m.embeds && m.embeds[0]) {
            var d = ""
            if(m.embeds[0].description) d = m.embeds[0].description.replace("<", "&lt;");
            var t = ""
            if(m.embeds[0].title) t = m.embeds[0].title.replace("<", "&lt;");
            var ma = maut(m);
            embeds = `<dembed> <pre>${ma}[T]${t}

${d}

[FIELDS AREN'T SUPPORTED YET]
</pre> </dembed>`
          }
          x = x + "<br /><br />" + m.author.tag + " -- " + m.content.replace("\n", "<br />") + embeds + `<button type="button" onclick="window.location.href = '?path=delMdm&dm=${dm}&message=${m.id}'">Delete</button>`
          remote = x
        })
        if(remote) {
          await wait()
        }
        return remote
      })
      })
    }



function wait () {} // just for timings
function maut(m) {
  if(m.author) 
    if(m.author.name)
      console.log("Found author")
      return "[A]" + m.author.name.replace("<", "&lt;") + "\n";
    else return "";
  else return "";
}
