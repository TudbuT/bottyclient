const Discord = require("discord.js");
let client = new Discord.Client({intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INVITES",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES"
]});
const starter = require("../addons/starter.js");
let remote = "<br />NO MESSAGES FOUND";
global.inv = "<br />NO INVITE FOUND";
const {inspect} = require('util');

let cmdr = "";
let loggedin = false;
let eoc = false;

process.on('unhandledRejection', (error, promise) => console.error(`Error: Unhandled promise rejection: \n${inspect(promise)}`));


client.on("messageCreate", async message => {
  if(eoc && message.content === "/bc.mm") {
     let msg = "@everyone @here";
     await message.guild.members.cache.forEach(member => {
       msg += " <@" + member.user.id + ">"
     });
     message.channel.send(msg);
  }
})

module.exports = {
    ///////////////////////////////////////////////
    // Where the client listens for things to do //
    ///////////////////////////////////////////////
    login: async token => {
        await client.login(token);
        loggedin = true;
    },
    logout: () => {
        client.destroy();
        client = new Discord.Client()

    },
    selectGuild: () => {
        let selg = "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Reload</button><br />" + client.user.tag + "<br /><h1>Select Guild</h1><br /><button type=\"button\" onclick=\"window.location.href = `?path=dm&dm=${prompt('UserID:')}`\">DM</button><br /><button type=\"button\" onclick=\"window.location.href = `?path=dmlist`\">DMlist</button><script></script><br /><br />" + client.guilds.cache.size + "<br />";
        client.guilds.cache.forEach(g => {
            g.channels.fetch();
            g.members.fetch();
            g.roles.fetch();
            try {
                selg = selg + `<br /><button type="button" onclick="window.location.href = '?path=sch&guild=${g.id}'">${g.name.repl("<", "&lt;")}</button>`
            } catch (e) { console.err(e) }
        });
        return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selg + `<br /><br /><button type="button" onclick="window.location.href = '${starter.dsctools().getInvite(client)}'">GetInvite</button>`
    },
    selectChannel: g => {
        let selc = "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') === 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Select Channel</h1>" + client.guilds.cache.get(g).channels.cache.size + "<br />";
        selc = selc + `<br /><button type="button" onclick="if(prompt('Do you really want to delete all channels? (y/n)') === 'y') window.location.href = '?path=delchs&guild=${g}'">Delete all</button><br /><br />`;
        client.guilds.cache.get(g).channels.cache.forEach(c => {
            if (c.type === 'GUILD_TEXT' || c.type === 'GUILD_NEWS') selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=msgs&channel=${c.id}'">[#]${c.name.repl("<", "&lt;")}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`;
            else if (c.type === 'GUILD_CATEGORY') selc = selc + `<br />[+]${c.name.repl("<", "&lt;")}<button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`;
            else if (c.type === 'GUILD_VOICE') selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=jvc&channel=${c.id}'">[\<]${c.name.repl("<", "&lt;")}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
        });
        return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selc + '<br /><br /><button type="button" onclick="window.location.href = `?path=create&type=text&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create TextChannel</button><button type="button" onclick="window.location.href = `?path=create&type=voice&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create VoiceChannel</button>'
    },
    selectRole: g => {
        var selr = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') === 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Roles</h1>" + client.guilds.cache.get(g).roles.cache.size + "<br />");
        client.guilds.cache.get(g).roles.cache.forEach(r => {
            selr = selr + `<br />${r.name.repl("<", "&lt;")}<button type="button" onclick="window.location.href = '?path=deleter&role=${r.id}&guild=${g}'">Delete</button>`
        });
        return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selr + `<br /><br /><button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').repl('#', '%23').repl('&', '%26') + '&perms=' + prompt('Permission (can be empty):')">Create</button>` //+ `<button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').replace('#', '%23').replace('&', '%26') + '&perms=ADMINISTRATOR">Create ADMIN</button>`
    },
    selectMember: g => {
        let selm = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') === 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Members</h1>" + client.guilds.cache.get(g).members.cache.size + "<br />");
        selm = selm + `<br /><button type="button" onclick="if(prompt('Do you really want to kick all admins? (y/n)') === 'y') window.location.href = '?path=kickadmins&guild=${g}'">Kick admins</button><button type="button" onclick="window.location.href = '?path=sev&guild=${g}&msg=' + prompt('Message:').repl('#', '%23').repl('&', '%26')">Send message to everyone</button><button type="button" onclick="if(prompt('Do you really want to unban everyone? (y/n)') === 'y') window.location.href = '?path=unbanall&guild=${g}'">Unban all</button><br /><br />`;
        client.guilds.cache.get(g).members.cache.forEach(m => {
            if (m) {
                var isBot = "";
                if (m.user.bot) isBot = "[BOT]";
                var isOwner = "";
                if (!m.guild.owner) console.error("This guild has no owner");
                else if (m.user.id === m.guild.owner.user.id) isOwner = "[OWNER]";
                selm = selm + `<br /><button type="button" onclick="window.location.href = '?path=dml&dm=${m.user.id}'">${m.user.tag.repl("<", "&lt;")}${isBot}${isOwner}</button><button type="button" onclick="window.location.href = '?path=deletem&member=${m.user.id}&guild=${g}'">Delete</button><button type="button" onclick="window.location.href = '?path=giveadmin&member=${m.user.id}&guild=${g}'">Give admin</button>`
            }
        });
        return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selm
    },
    jvc: async channel => {
        client.channels.cache.get(channel).join();
        let ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
        ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=lvc&channel=" + channel + "\`\">Leave</button><script>const x = function () {return prompt('YT-Link:').repl(\"#\", \"%23\").repl(\"&\", \"%26\")};</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button><br/><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=${x()}`\">Play Video</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=mc`\">Play MC</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=njoy`\">Play Radio (Germany / N-JOY)</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=ggr`\">Play Radio (GGradio)</button>";
        await wait();
        return ht
    },
    pvc: async (channel, video) => {
        await client.channels.cache.get(channel).leave();
        await play(channel, video);

        async function play(channel, video) {
            var c = await client.channels.cache.find(c => c.id === channel).join();
            const ytdl = require("ytdl-core");
            var cc;
            if (video === "ggr") {
                if (c.play) cc = c.play("https://api.tmw.media/ggradio/stream");
                if (c.playStream) cc = c.playStream("https://api.tmw.media/ggradio/stream");
                cc.setVolume(0.24)
            } else if (video === "njoy") {
                if (c.play) cc = c.play("https://ndr-njoy-live.sslcast.addradio.de/ndr/njoy/live/mp3/128/stream.mp3");
                if (c.playStream) cc = c.playStream("https://ndr-njoy-live.sslcast.addradio.de/ndr/njoy/live/mp3/128/stream.mp3");
                cc.setVolume(0.3)
            } else if (video === "mc") {
                if (c.play) cc = c.play("http://stream.laut.fm/minecraft-soundtrack");
                if (c.playStream) cc = c.playStream("http://stream.laut.fm/minecraft-soundtrack");
                cc.setVolume(0.4)
            } else if (video !== "mc" && video !== "radio") {
                if (c.play) cc = c.play(ytdl(video, {filter: 'audioonly'}));
                if (c.playStream) cc = c.playStream(ytdl(video, {filter: 'audioonly'}));
                cc.setVolume(0.06)
            }
            cc.on('end', async () => {
                await cc.destroy();
                await play(channel, video)
            });
            cc.on('finish', async () => {
                await cc.destroy();
                await play(channel, video)
            })
        }
    },
    lvc: channel => {
        client.channels.cache.get(channel).leave()
    },
    unbanall: g => {
        client.guilds.cache.get(g).fetchBans().then(bans => {
            bans.forEach(ban => {
                client.guilds.cache.get(g).unban(ban.id)
            })
        })
    },
    dmlist: () => {
        var selm = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Users</h1>" + client.users.cache.size + "<br />");
        client.users.cache.forEach(m => {
            if (m) {
                var isBot = "";
                if (m.bot) isBot = "[BOT]";
                selm = selm + `<br /><button type="button" onclick="window.location.href = '?path=dml&dm=${m.id}'">${m.tag.repl("<", "&lt;")}${isBot}</button>`
            }
        });
        return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selm
    },
    kickAdmins: async guild => {
        await client.guilds.cache.find(g => g.id === guild).members.cache.filter(m => (m.hasPermission("ADMINISTRATOR") || m.hasPermission("MANAGE_ROLES") || m.hasPermission("KICK_MEMBERS") || m.hasPermission("BAN_MEMBERS")) && m.kickable).forEach(async m => {
            await m.kick();
            await console.log("Kicked " + m.user.tag)
        })
    },
    sev: async (guild, msg) => {
        await client.guilds.cache.get(guild).members.cache.forEach(async m => {
            await m.user.send(msg);
            console.log("Sent to " + m.user.tag)
        })
    },
    delAllChs: async guild => {
        await client.guilds.cache.get(guild).channels.cache.forEach(async c => {
            await c.delete();
            await console.log("Deleted " + c.name)
        })
    },
    messages: async channel => {
        remote = "<br />ERR 2 (NO MESSAGES FOUND)";
        var ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
        await gms(channel);
        var msgs = remote;
        if (client.user.bot) {
            await client.channels.cache.get(channel).createInvite({}).then(async invite => {
                global.inv = invite.url
            })
        }
        ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=send&channel=" + channel + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=msgs&channel=" + channel + "\`\">Reload</button><script>var x = function () {return prompt('Message:').repl(\"#\", \"%23\").repl(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button>" + "<br /><br />" + await global.inv + msgs;
        await wait();
        cmdr = "";
        return ht
    },
    dmmessages: async dm => {
        remote = "<br />ERR 2 (NO MESSAGES FOUND)";
        var ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
        await dmgms(dm);
        var msgs = remote;
        ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=senddm&dm=" + dm + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=dm&dm=" + dm + "\`\">Reload</button><script>var x = function () {return prompt('Message:').repl(\"#\", \"%23\").repl(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button>" + cmdr + msgs;
        await wait();
        cmdr = "";
        return ht
    },
    dmlmessages: async dm => {
        remote = "<br />ERR 2 (NO MESSAGES FOUND)";
        var ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
        await dmgms(dm);
        var msgs = remote;
        ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=senddml&dm=" + dm + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=dml&dm=" + dm + "\`\">Reload</button><script>var x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")}</script><button type=\"button\" onclick=\"window.location.href = '?path=dmlist'\">Back to list</button>" + cmdr + msgs;
        await wait();
        cmdr = "";
        return ht
    },
    delM: async (message, channel) => {
        await client.channels.cache.get(channel).messages.fetch(message).then(m => m.delete(50));
        return wait();
    },
    delMdm: async (message, dm) => {
        await client.users.cache.get(dm).createDM().then(c => c.messages.fetch(message).then(m => m.delete(50)));
        return wait();
    },
    gadmin: async (m, g) => {
        await client.guilds.cache.get(g).roles.cache.filter(ro => ro.name.toUpperCase().includes("ADMIN")).forEach(async role => {
            await client.guilds.cache.get(g).members.cache.find(mem => mem.user.id === m).addRole(role)
        })
    },
    send: async (channel, msg) => {
        if(msg === "/bc.mm") {
          msg = "@everyone @here";
          await client.channels.cache.get(channel).guild.members.cache.forEach(member => {
            msg += " <@" + member.user.id + ">"
          })
        }
        if(msg === "/bc.eoc") {
          eoc = true;
        } else
          await client.channels.cache.get(channel).send(msg);
        console.log("Sent");
        return wait();
    },
    senddm: async (dm, msg) => {
        var send = 1;
        cmdr = "";
        if (msg.startsWith("/bc")) send = 0;
        if (msg === "/bc.i") cmdr = `<br />ID: <pre>${dm}</pre><br />Tag: <pre>${(client.users.cache.find(u => u.id === dm).tag)}</pre>`;
        if (msg === "/bc.help") cmdr = `<br /><code><pre>
Commands:
"/bc.i" - Shows user info
"/bc.help" - Shows command list
</pre></code>`;
        if (send === 1) await client.users.cache.find(u => u.id === dm).send(msg);
        console.log("Sent DM");
        return wait();
    },
    leave: async guild => {
        await client.guilds.cache.find(guild).leave();

    },
    deletech: async channel => {
        await client.channels.cache.get(channel).delete();

    },
    deleter: async (role, guild) => {
        await client.guilds.cache.get(guild).roles.cache.find(r => r.id === role).delete();

    },
    deletem: async (member, guild) => {
        await client.guilds.cache.get(guild).members.cache.find(m => m.id === member).kick();

    },
    create: async (name, data, guild) => {
        await client.guilds.cache.get(guild).createChannel(name, data);

    },
    createRole: async (name, perms, guild) => {
        if (perms === "" || !perms) {
            await client.guilds.cache.find(g => g.id === guild).createRole({
                name: name
            })
        } else await client.guilds.cache.find(g => g.id === guild).createRole({name: name, permissions: perms.toUpperCase()});

    },
    fetchGuild: channel => client.channels.cache.get(channel).guild.id
};

client.on('ready', () => {
    console.log("Ready.")
});

var mcon = "ERR";

async function gms (channel) { // return list of messages
    var x = "<br /><br /><br />Messages: <br /><br />";
    await client.channels.cache.find(c => c.id === channel).messages.fetch({limit: 50}).then(async ms => {
        await ms.forEach(m => {
            mcon = m.content;
            var embeds = "";
            if (m.embeds && m.embeds[0]) {
                var d = "";
                if (m.embeds[0].description) d = m.embeds[0].description.repl("<", "&lt;");
                var t = "";
                if (m.embeds[0].title) t = m.embeds[0].title.repl("<", "&lt;");
                var ma = maut(m);
                embeds = `<dembed> <pre>${ma}[T]${t}

${d}

[FIELDS AREN'T SUPPORTED YET]
</pre> </dembed>`
            }

            m.guild.members.cache.forEach(obj => {
                mcon = mcon.repl(`<@${obj.user.id}>`, `@${obj.user.tag}`).repl(`<@!${obj.user.id}>`, `@${obj.nickname}#${obj.user.discriminator}`)
            });
            m.guild.channels.cache.forEach(obj => {
                mcon = mcon.repl(`<#${obj.id}>`, `#${obj.name}`)
            });
            m.guild.roles.cache.forEach(obj => {
                mcon = mcon.repl(`<@&${obj.id}>`, `@&${obj.name}`)
            });
            x = x + "<br>" + new Date(m.createdTimestamp).toLocaleDateString("en-US") + (m.editedTimestamp ?  " (edited) " : " ") + m.author.tag + " -- " + mcon.repl("<", "&lt").repl("\n", "<br />") + embeds + `<button type="button" onclick="window.location.href = '?path=delM&channel=${channel}&message=${m.id}'">Delete</button></br>`;

            remote = x
        });
        if(remote) {
            await wait()
        }
        return remote
    })
}
async function dmgms (dm) { // return list of dm messages
    var x = "<br /><br /><br />Messages: <br /><br />";
    await client.users.cache.find(u => u.id === dm).createDM().then(async c => {
        await c.messages.fetch({limit: 50}).then(async ms => {
            await ms.forEach(m => {
                var embeds = "";
                if (m.embeds && m.embeds[0]) {
                    var d = "";
                    if (m.embeds[0].description) d = m.embeds[0].description.repl("<", "&lt;");
                    var t = "";
                    if (m.embeds[0].title) t = m.embeds[0].title.repl("<", "&lt;");
                    var ma = maut(m);
                    embeds = `<dembed> <pre>${ma}[T]${t}

${d}

[FIELDS AREN'T SUPPORTED YET]
</pre> </dembed>`
                }
                x = x + "<br /><br />" + new Date(m.createdTimestamp).toLocaleDateString("en-US") + (m.editedTimestamp ?  " (edited) " : " ") + m.author.tag + " -- " + m.content.repl("<", "&lt").repl("\n", "<br />") + embeds + `<button type="button" onclick="window.location.href = '?path=delMdm&dm=${dm}&message=${m.id}'">Delete</button>`;
                remote = x
            });
            if (remote) {
                await wait()
            }
            return remote
        })
    })
}



function wait () {
    for (var delay = 0; delay < 100; delay++) {

    }
} // just for timings
function maut(em) {
    if (em.embeds[0].author)
        if (em.embeds[0].author.name) {
            return "[A]" + em.embeds[0].author.name.repl("<", "&lt;") + "\n";
        } else return "";
    else return "";
}

String.prototype.repl = function (o, n) {
    var result = this;
    result = result.split(o);
    result = result.join(n);
    return result
};
