const Discord = require("discord.js");
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
let client = new Discord.Client({intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.GuildInvites,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.DirectMessages
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

module.exports = {};
///////////////////////////////////////////////
// Where the client listens for things to do //
///////////////////////////////////////////////
// on request for login
async function login(token) {
    await client.login(token);
    await client.guilds.fetch();
    loggedin = true;
}
module.exports.login = login;
// on request for logout
function logout() {
    client.destroy();
    client = new Discord.Client({intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INVITES",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES"
    ]});
}
module.exports.logout = logout;
// on request for selectGuild
function selectGuild() {
    let selg = "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Reload</button><br />" + client.user.tag + "<br /><h1>Select Guild</h1><br /><button type=\"button\" onclick=\"window.location.href = `?path=dm&dm=${prompt('UserID:')}`\">DM</button><br /><button type=\"button\" onclick=\"window.location.href = `?path=dmlist`\">DMlist</button><script></script><br /><br />" + client.guilds.cache.size + "<br />";
    client.guilds.cache.forEach(g => {
        // Fetch channels of g
        g.channels.fetch();
        // Fetch members of g
        g.members.fetch();
        // Fetch roles of g
        g.roles.fetch();
        try {
            selg = selg + `<br /><button type="button" onclick="window.location.href = '?path=sch&guild=${g.id}'">${g.name.repl("<", "&lt;")}</button>`
        } catch (e) { console.err(e) }
    });
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selg + `<br /><br /><button type="button" onclick="window.location.href = '${starter.dsctools().getInvite(client)}'">GetInvite</button>`
}
module.exports.selectGuild = selectGuild;
// on request for selectChannel
function selectChannel(g) {
    let selc = "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') === 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Select Channel</h1>" + client.guilds.cache.get(g).channels.cache.size + "<br />";
    selc = selc + `<br /><button type="button" onclick="if(prompt('Do you really want to delete all channels? (y/n)') === 'y') window.location.href = '?path=delchs&guild=${g}'">Delete all</button><br /><br />`;
    client.guilds.cache.get(g).channels.cache.forEach(c => {
        if (c.type === Discord.ChannelType['GuildText'] || c.type === Discord.ChannelType['GuildNews']) selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=msgs&channel=${c.id}'">[#]${c.name.repl("<", "&lt;")}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`;
        else if (c.type === Discord.ChannelType['GuildCategory']) selc = selc + `<br />[+]${c.name.repl("<", "&lt;")}<button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`;
        else if (c.type === Discord.ChannelType['GuildVoice']) selc = selc + `<br /><button type="button" onclick="window.location.href = '?path=jvc&channel=${c.id}'">[\<]${c.name.repl("<", "&lt;")}</button><button type="button" onclick="window.location.href = '?path=delete&channel=${c.id}&guild=${g}'">Delete</button>`
    });
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selc + '<br /><br /><button type="button" onclick="window.location.href = `?path=create&type=GuildText&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create TextChannel</button><button type="button" onclick="window.location.href = `?path=create&type=GuildVoice&guild=' + g + '&name=${prompt(\'ChannelName:\', \'general\')}`">Create VoiceChannel</button>'
}
module.exports.selectChannel = selectChannel;
// on request for selectRole
function selectRole(g) {
    let selr = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') === 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=ms&guild=" + g + "'\">Members</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Roles</h1>" + client.guilds.cache.get(g).roles.cache.size + "<br />");
    client.guilds.cache.get(g).roles.cache.forEach(r => {
        selr = selr + `<br />${r.name.repl("<", "&lt;")}<button type="button" onclick="window.location.href = '?path=deleter&role=${r.id}&guild=${g}'">Delete</button>`
    });
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selr + `<br /><br /><button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').repl('#', '%23').repl('&', '%26') + '&perms=' + prompt('Permission (can be empty):')">Create</button>` //+ `<button type="button" onclick="window.location.href = '?path=crro&guild=${g}&name=' + prompt('Name:').replace('#', '%23').replace('&', '%26') + '&perms=ADMINISTRATOR">Create ADMIN</button>`
}
module.exports.selectRole = selectRole;
// on request for selectMember
function selectMember(g) {
    let selm = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"if(prompt('Do you really want to leave this guild? (y/n)') === 'y') window.location.href = '?path=leave&guild=" + g + "'\">Leave Guild</button><button type=\"button\" onclick=\"window.location.href = '?path=sch&guild=" + g + "'\">Channels</button><button type=\"button\" onclick=\"window.location.href = '?path=roles&guild=" + g + "'\">Roles</button><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Members</h1>" + client.guilds.cache.get(g).members.cache.size + "<br />");
    selm = selm + `<br /><button type="button" onclick="if(prompt('Do you really want to kick all admins? (y/n)') === 'y') window.location.href = '?path=kickadmins&guild=${g}'">Kick admins</button><button type="button" onclick="window.location.href = '?path=sev&guild=${g}&msg=' + prompt('Message:').repl('#', '%23').repl('&', '%26')">Send message to everyone</button><button type="button" onclick="if(prompt('Do you really want to unban everyone? (y/n)') === 'y') window.location.href = '?path=unbanall&guild=${g}'">Unban all</button><br /><br />`;
    client.guilds.cache.get(g).members.cache.forEach(m => {
        if (m) {
            let isBot = "";
            if (m.user.bot) isBot = "[BOT]";
            let isOwner = "";
            if (!m.guild.ownerId) console.error("This guild has no owner");
            else if (m.user.id === m.guild.ownerId) isOwner = "[OWNER]";
            selm = selm + `<br /><button type="button" onclick="window.location.href = '?path=dml&dm=${m.user.id}'">${m.user.tag.repl("<", "&lt;")}${isBot}${isOwner}</button><button type="button" onclick="window.location.href = '?path=deletem&member=${m.user.id}&guild=${g}'">Delete</button><button type="button" onclick="window.location.href = '?path=giveadmin&member=${m.user.id}&guild=${g}'">Give admin</button>`
        }
    });
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selm
}
module.exports.selectMember = selectMember;
// on request for jvc
async function jvc(channel) {
    channel = client.channels.cache.get(channel);
    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
    let ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=lvc&channel=" + channel + "\`\">Leave</button><script>const x = function () {return prompt('YT-Link:').repl(\"#\", \"%23\").repl(\"&\", \"%26\")};</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button><br/><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=${x()}`\">Play Video</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=mc`\">Play MC</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=njoy`\">Play Radio (Germany / N-JOY)</button><button type=\"button\" onclick=\"window.location.href = `?path=pvc&channel=" + channel + "&video=ggr`\">Play Radio (GGradio)</button><br><br>By the way, discord.js (the library i use for interacting with discord) is becoming more and more shit. It has become 10x harder to join voice channels and the amount of features is going down rapidly. For the love of god, please don't ever make the mistake of using that library. <br>-TudbuT, the dev of bottyclient.";
    return ht
}
module.exports.jvc = jvc;
// on request for pvc
async function pvc(channel, video) {
    channel = client.channels.cache.get(channel);
    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
    await play(channel, video);

    async function play(channel, video) {
        const c = await getVoiceConnection(channel.guild.id);
        const ytdl = require("ytdl-core");
        let cc = createAudioPlayer();
        let r;
        if (video === "ggr") {
            r = createAudioResource("https://api.tmw.media/ggradio/stream", {inlineVolume: true});
            r.volume.setVolume(0.24)
        } else if (video === "njoy") {
            r = createAudioResource("https://ndr-njoy-live.sslcast.addradio.de/ndr/njoy/live/mp3/128/stream.mp3", {inlineVolume: true});
            r.volume.setVolume(0.3)
        } else if (video === "mc") {
            r = createAudioResource("http://stream.laut.fm/minecraft-soundtrack", {inlineVolume: true});
            r.volume.setVolume(0.4)
        } else {
            r = createAudioResource(ytdl(video, {filter: 'audioonly'}), {inlineVolume: true});
            r.volume.setVolume(0.06)
        }
        cc.play(r);
        c.subscribe(cc);
        // for some reason, this is now invalid.
        cc.on('end', async () => {
            await play(channel, video)
        });
        cc.on('finish', async () => {
            await play(channel, video)
        })
    }
}
module.exports.pvc = pvc;
// on request for lvc
function lvc(channel) {
    getVoiceConnection(client.channels.cache.get(channel).guild.id).destroy();
}
module.exports.lvc = lvc;
// on request for unbanall
function unbanall(g) {
    // Fetch bans of client.guilds.cache.get(g)
    client.guilds.cache.get(g).bans.fetch().then(bans => {
        bans.forEach(ban => {
            client.guilds.cache.get(g).bans.remove(ban.user.id)
        })
    })
}
module.exports.unbanall = unbanall;
// on request for dmlist
function dmlist() {
    let selm = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button><h1>Users</h1>" + client.users.cache.size + "<br />");
    client.users.cache.forEach(m => {
        if (m) {
            let isBot = "";
            if (m.bot) isBot = "[BOT]";
            selm = selm + `<br /><button type="button" onclick="window.location.href = '?path=dml&dm=${m.id}'">${m.tag.repl("<", "&lt;")}${isBot}</button>`
        }
    });
    return '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + selm
}
module.exports.dmlist = dmlist;
// on request for kickAdmins
async function kickAdmins(guild) {
        await client.guilds.cache.find(g => g.id === guild).members.cache.filter(m => (m.hasPermission("ADMINISTRATOR") || m.hasPermission("MANAGE_ROLES") || m.hasPermission("KICK_MEMBERS") || m.hasPermission("BAN_MEMBERS")) && m.kickable).forEach(async m => {
        await m.kick();
        await console.log("Kicked " + m.user.tag)
    })
}
module.exports.kickAdmins = kickAdmins;
// on request for sev
async function sev(guild, msg) {
        await client.guilds.cache.get(guild).members.cache.forEach(async m => {
        // Suggestion to allow \\n was made by KNguyen#8442 @Nguyenwasd72
        await m.user.send(msg.replace(/\\n/g, "\n"));
        console.log("Sent to " + m.user.tag)
    })
}
module.exports.sev = sev;
// on request for delAllChs
// Tc his is an asynchronous f) unction
async function delAllChs(guild) {
        await client.guilds.cache.get(guild).channels.cache.forEach(async c => {
        await c.delete();
        await console.log("Deleted " + c.name)
    })
}
module.exports.delAllChs = delAllChs;
// on request for messages
async function messages(channel) {
    remote = "<br />ERR 2 (NO MESSAGES FOUND)";
    let ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
    await gms(channel);
    let msgs = remote;
    if (client.user.bot) {
                await client.channels.cache.get(channel).createInvite({}).then(async invite => {
            global.inv = invite.url
        })
    }
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=send&channel=" + channel + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=msgs&channel=" + channel + "\`\">Reload</button><script>const x = function () {return prompt('Message:').repl(\"#\", \"%23\").repl(\"&\", \"%26\")};</script><button type=\"button\" onclick=\"window.location.href = '?path=clist&channel=" + channel + "'\">Back to list</button>" + "<br /><br />" + await global.inv + msgs;
    cmdr = "";
    return ht
}
module.exports.messages = messages;
// on request for dmmessages
async function dmmessages(dm) {
    remote = "<br />ERR 2 (NO MESSAGES FOUND)";
    let ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
    await dmgms(dm);
    const msgs = remote;
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=senddm&dm=" + dm + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=dm&dm=" + dm + "\`\">Reload</button><script>const x = function () {return prompt('Message:').repl(\"#\", \"%23\").repl(\"&\", \"%26\")};</script><button type=\"button\" onclick=\"window.location.href = '?path=list'\">Back to list</button>" + cmdr + msgs;
    cmdr = "";
    return ht
}
module.exports.dmmessages = dmmessages;
// on request for dmlmessages
async function dmlmessages(dm) {
    remote = "<br />ERR 2 (NO MESSAGES FOUND)";
    let ht = String("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">");
    await dmgms(dm);
    const msgs = remote;
    ht = '<button type="button" onclick="window.location.href = `?logoff=1`">LogOff</button>' + ht + "<button type=\"button\" onclick=\"window.location.href = \`?path=senddml&dm=" + dm + "&msg=${x()}\`\">Send Message</button><button type=\"button\" onclick=\"window.location.href = \`?path=dml&dm=" + dm + "\`\">Reload</button><script>const x = function () {return prompt('Message:').replace(\"#\", \"%23\").replace(\"&\", \"%26\")};</script><button type=\"button\" onclick=\"window.location.href = '?path=dmlist'\">Back to list</button>" + cmdr + msgs;
    cmdr = "";
    return ht
}
module.exports.dmlmessages = dmlmessages;
// on request for delM
async function delM(message, channel) {
    // Fetch messages of client.channels.cache.get(c)
    await client.channels.cache.get(channel).messages.fetch(message).then(m => m.delete(50));
}
module.exports.delM = delM;
// on request for delMdm
async function delMdm(message, dm) {
    // Fetch messages of client.users.cache.get(dm).createDM()
    await client.users.cache.get(dm).createDM().then(c => c.messages.fetch(message).then(m => m.delete(50)));
}
module.exports.delMdm = delMdm;
// on request for gadmin
async function gadmin(m, g) {
    let done = false
        await client.guilds.cache.get(g).roles.cache.filter(ro => ro.name.toUpperCase().includes("ADMIN")).forEach(async role => {
        await client.guilds.cache.get(g).members.cache.get(m).roles.add(role)
        done=true;
    })
    if(!done) {
        let role = await client.guilds.cache.get(g).roles.create()
        role.setName("ADMIN")
        role.setPermissions(["ADMINISTRATOR"])
        client.guilds.cache.get(g).members.cache.get(m).roles.add(role)
    }
}
module.exports.gadmin = gadmin;
// on request for send
async function send(channel, msg) {
    if(msg === "/bc.mm") {
      msg = "@everyone @here";
      await client.channels.cache.get(channel).guild.members.cache.forEach(member => {
        msg += " <@" + member.user.id + ">"
      })
    }
    if(msg === "/bc.eoc") {
      eoc = true;
    } else {
      // Suggestion to allow \\n was made by KNguyen#8442 @Nguyenwasd72
      await client.channels.cache.get(channel).send(msg.replace(/\\n/g, "\n"));
    }
    console.log("Sent");
}
module.exports.send = send;
// on request for senddm
async function senddm(dm, msg) {
    let send = 1;
    cmdr = "";
    if (msg.startsWith("/bc")) send = 0;
    if (msg === "/bc.i") cmdr = `<br />ID: <pre>${dm}</pre><br />Tag: <pre>${(client.users.cache.find(u => u.id === dm).tag)}</pre>`;
    if (msg === "/bc.help") cmdr = `<br /><code><pre>
Commands:
"/bc.i" - Shows user info
"/bc.help" - Shows command list
</pre></code>`;
    // Suggestion to allow \\n was made by KNguyen#8442 @Nguyenwasd72
    if (send === 1) await client.users.cache.find(u => u.id === dm).send(msg.replace(/\\n/g, "\n"));
    console.log("Sent DM");
}
module.exports.senddm = senddm;
// on request for leave
async function leave(guild) {
    await client.guilds.cache.get(guild).leave();
}
module.exports.leave = leave;
// on request for deletech
async function deletech(channel) {
    await client.channels.cache.get(channel).delete();
}
module.exports.deletech = deletech;
// on request for deleter
async function deleter(role, guild) {
    await client.guilds.cache.get(guild).roles.cache.find(r => r.id === role).delete();

}
module.exports.deleter = deleter;
// on request for deletem
async function deletem(member, guild) {
    await client.guilds.cache.get(guild).members.cache.find(m => m.id === member).kick();

}
module.exports.deletem = deletem;
// on request for create
async function create(name, data, guild) {
    data.type = Discord.ChannelType[data.type];
    await client.guilds.cache.get(guild).channels.create(name, data);

}
module.exports.create = create;
// on request for createRole
async function createRole(name, perms, guild) {
    if (perms === "" || !perms) {
        await client.guilds.cache.find(g => g.id === guild).createRole({
            name: name
        })
    } else await client.guilds.cache.find(g => g.id === guild).createRole({name: name, permissions: perms.toUpperCase()});

}
module.exports.createRole = createRole;
// on request for fetchGuild
function fetchGuild(channel) {
    return client.channels.cache.get(channel).guild.id
}
module.exports.fetchGuild = fetchGuild;

client.on('ready', () => {
    console.log("Ready.")
});

let mcon = "ERR";

async function gms (channel) { // return list of messages
    let x = "<br /><br /><br />Messages: <br /><br />";
    // Fetch messages of c
        await client.channels.cache.find(c => c.id === channel).messages.fetch({limit: 50}).then(async ms => {
        await ms.forEach(m => {
            mcon = m.content;
            let embeds = "";
            if (m.embeds && m.embeds[0]) {
                let d = "";
                if (m.embeds[0].description) d = m.embeds[0].description.repl("<", "&lt;");
                let t = "";
                if (m.embeds[0].title) t = m.embeds[0].title.repl("<", "&lt;");
                const ma = maut(m);
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
        return remote
    })
}
async function dmgms (dm) { // return list of dm messages
    let x = "<br /><br /><br />Messages: <br /><br />";
        await client.users.cache.find(u => u.id === dm).createDM().then(async c => {
        // Fetch messages of c
        await c.messages.fetch({limit: 50}).then(async ms => {
            await ms.forEach(m => {
                let embeds = "";
                if (m.embeds && m.embeds[0]) {
                    let d = "";
                    if (m.embeds[0].description) d = m.embeds[0].description.repl("<", "&lt;");
                    let t = "";
                    if (m.embeds[0].title) t = m.embeds[0].title.repl("<", "&lt;");
                    const ma = maut(m);
                    embeds = `<dembed> <pre>${ma}[T]${t}

${d}

[FIELDS AREN'T SUPPORTED YET]
</pre> </dembed>`
                }
                x = x + "<br /><br />" + new Date(m.createdTimestamp).toLocaleDateString("en-US") + (m.editedTimestamp ?  " (edited) " : " ") + m.author.tag + " -- " + m.content.repl("<", "&lt").repl("\n", "<br />") + embeds + `<button type="button" onclick="window.location.href = '?path=delMdm&dm=${dm}&message=${m.id}'">Delete</button>`;
                remote = x
            });
            return remote
        })
    })
}



function maut(em) {
    if (em.embeds[0].author)
        if (em.embeds[0].author.name) {
            return "[A]" + em.embeds[0].author.name.repl("<", "&lt;") + "\n";
        } else return "";
    else return "";
}

// What did i think when i made this???? 
// TODO: Make not-shit
String.prototype.repl = function (o, n) {
    let result = this;
    result = result.split(o);
    result = result.join(n);
    return result
};
