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
    var selc = new String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><h1>Select Channel</h1>")
    client.guilds.get(g).channels.forEach(c => {
      selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=msgs&channel=${c.id}&guild=${c.guild.id}'">${c.name}</button>`
    })
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selc
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
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=send&channel=" + channel + "&msg=${prompt('Message:')}\`\">Send Message</button>"
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
  }
}

client.on('ready', () => {
  console.log("Ready.")
})
