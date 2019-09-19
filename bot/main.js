const Discord = require("discord.js")
const client = new Discord.Client()

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
    var selg = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><h1>Select Guild</h1><br /><button type=\"button\" onclick=\"window.location.href = `?path=dm&dm=${prompt('UserID:')}&msg=${prompt('Message')}`\">DM</button><br /><br />")
    client.guilds.forEach(g => {
      selg = selg + `<br /><button type="button" onclick="window.location.href = '?path=sch&guild=${g.id}'">${g.name}</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selg
  },
  selectChannel: function(g){
    var selc = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Select Channel</h1>")
    client.guilds.get(g).channels.forEach(c => {
      selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=msgs&channel=${c.id}'">${c.name}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selc + '<br /><br /><button type="button" onclick="window.location.href = `?path=create&type=text&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create TextChannel</button><button type="button" onclick="window.location.href = `?path=create&type=voice&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create VoiceChannel</button>'
  },
  messages: function(channel) {
    var ht = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">")
    var msgs = new String()
    /*client.channels.find(c => c.id == channel).fetchMessages({limit:1}).then(msgs_ => {
      msgs_.forEach(msg => {
        //msgs = `${msgs}<br />${msg.content}`
      })
    }).then(() => {
    */
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=send&channel=" + channel + "&msg=${prompt('Message:')}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button>"
    //const x = ht + msgs
    console.log(ht)
    return ht
    //})
  },
  send: function (channel, msg) {
    client.channels.find(c => c.id == channel).send(msg)
  },
  dm: function (userid, msg) {
    client.users.find(u => u.id == userid).send(msg)
  },
  leave: async function (guild) {
    await client.guilds.find(g => g.id == guild).leave()
    return
  },
  deletech: async function(channel) {
    await client.channels.find(c => c.id == channel).delete()
    return
  },
  create: async function (name, data, guild) {
    await client.guilds.find(g => g.id == guild).createChannel(name, data)
    return
  },
  getGuild: function(channel) {
    return client.channels.find(c => c.id == channel).guild.id
  }
}

client.on('ready', () => {
  console.log("Ready.")
})
