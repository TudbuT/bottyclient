const Discord = require("discord.js")
const client = new Discord.Client()
const starter = require("../addons/starter.js")
var remote = "ERROR"

var loggedin = new Boolean(false)
module.exports = {
  login: async function (token) {
    await client.login(token)
    loggedin = true
    return
  },
  logout: function () {
    client.destroy()
  },
  selectGuild: function(){
    var selg = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Reload</button><br />" + client.user.tag + "<br /><h1>Select Guild</h1><br /><button type=\"button\" onclick=\"window.location.href = `?path=dm&dm=${prompt('UserID:')}`\">DM</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><br /><br />")
    client.guilds.forEach(g => {
      selg = selg + `<br /><button type="button" onclick="window.location.href = '?path=sch&guild=${g.id}'">${g.name}</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selg + `<br /><br /><button type="button" onclick="alert('${starter.dsctools().getInvite(client)}')">GetInvite</button>`
  },
  selectChannel: function(g){
    var selc = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') == 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Select Channel</h1>")
    client.guilds.get(g).channels.forEach(c => {
      if(c.type == 'text') selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=msgs&channel=${c.id}'">${c.name}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
      else selc = selc + `<br />${c.name}<button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selc + '<br /><br /><button type="button" onclick="window.location.href = `?path=create&type=text&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create TextChannel</button><button type="button" onclick="window.location.href = `?path=create&type=voice&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create VoiceChannel</button>'
  },
  selectRole: function(g){
    var selr = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') == 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Roles</h1>")
    client.guilds.get(g).roles.forEach(r => {
      selr = selr + `<br />${r.name}<button type="button" onclick="window.location.href = '?path=deleter&role=${r.id}&guild=${g}'">Delete</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selr + `<br /><br /><button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').replace('#', '%23').replace('&', '%26') + '&perms=' + prompt('Permission (can be empty):')">Create</button>` //+ `<button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').replace('#', '%23').replace('&', '%26') + '&perms=ADMINISTRATOR">Create ADMIN</button>`
  },
  selectMember: function(g){
    var selm = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') == 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Members</h1>")
    client.guilds.get(g).members.forEach(m => {
      var isBot = ""
      if(m.user.bot) isBot = "[BOT]"
      var isOwner = ""
      if(m.user.id == m.guild.owner.user.id) isOwner = "[OWNER]"
      selm = selm + `<br />${m.user.tag}${isBot}${isOwner}<button type="button" onclick="window.location.href = '?path=deletem&member=${m.user.id}&guild=${g}'">Delete</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selm
  },
  messages: async function(channel) {
    var ht = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">")
    await gms(channel)
    var msgs = remote
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=send&channel=" + channel + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=msgs&channel=" + channel + "\`\">Reload</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button>" + msgs
    await wait()
    return ht
  },
  cmessages: async function(channel) {
    var ht = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">")
    await cgms(channel)
    var msgs = remote
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=send&channel=" + channel.id + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=msgs&channel=" + channel.id + "\`\">Reload</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button>" + msgs
    await wait()
    return ht
  },
  delM: async function(message, channel) {
    await client.channels.find(c => c.id == channel).fetchMessages({limit: 100}).then(m => m.find(_m => _m.id == message).delete(50))
    return await wait()
  },
  send: async function (channel, msg) {
    await client.channels.find(c => c.id == channel).send(msg)
    return await wait()
  },
  fetchdm: function (userid) {
    return client.users.find(u => u.id == userid).createDM().id
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
  getGuild: function(channel) {
    return client.channels.find(c => c.id == channel).guild.id
  }
}

client.on('ready', () => {
  console.log("Ready.")
})

async function gms (channel) {
      var x = "<br /><br /><br />Messages: <br /><br />"
      await client.channels.find(c => c.id == channel).fetchMessages({limit: 50}).then(async ms => {
        await ms.forEach(m => {
          x = x + "<br>" + m.author.tag + " -- " + m.content.replace("\n", "<br />") + `<button type="button" onclick="window.location.href = '?path=delM&channel=${channel}&message=${m.id}'">Delete</button></br>`
          remote = x
        })
        if(remote) {
          await wait()
        }
        return remote
      })
    }
async function cgms (channel) {
      var x = "<br /><br /><br />Messages: <br /><br />"
      await channel.fetchMessages({limit: 50}).then(async ms => {
        await ms.forEach(m => {
          x = x + "<br>" + m.author.tag + " -- " + m.content.replace("\n", "<br />") + `<button type="button" onclick="window.location.href = '?path=delM&channel=${channel}&message=${m.id}'">Delete</button></br>`
          remote = x
        })
        if(remote) {
          await wait()
        }
        return remote
      })
    }

function wait () {}
