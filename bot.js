//bot requirements
const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = "!";
const fs = require('fs')
const request = require('request')
const async = require("async")
var gameMessage = new Function('return true')

//Bot Code

var inv = '486093327662448650'

//rooms
var attic = '484294432204521472'
var bedroom = '484294343021297677'
var bathroom = '484294365234331658'
var kitchen = '484294384423010305'
var livingroom = '484294411274944513'
var basement = '484293337323667469'

//evidence
var bm428 = '487726829583466497'
var enf = '495362866510168084'

//suspects
var misfit = '484532103233536022'
var nakpin = '484532310881075201'
var ommie = '484532332078825492'
var poot = '484532378572816394'
var vee = '484532403826589697'
var dilemma = '484532445325033504'
var aqua = '484532482411069463'
var runaway = '484532515307126789'
var cate = '484532686032076802'
var x2 = '484532739169845248'
var taxxi = '484532774661914637'
var yersh = '484532786183667725'
var chris = '484532846669594625'
var tree = '484532857520390144'
var spooky = '484532871495942149'
var vipie = '484532924679585799'

//
var testrole = '486096707054993439'

//me
const testacc = '270017125815418901'

//functions
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function basicEmbed(color, text) {
    var embed = { "description": `${text}`, "color": color };
    return embed
}

function topicEmbed(color, text, title) {
    var embed = { "description": `${text}`, "color": color, "author": {"name": title}};
    return embed
}

function richEmbed(color, commands, descriptions, title) {
    var embed = {"color":color, "author":{"name":title}, "fields":[]}
    for (var i in commands) {
        embed.fields.push({"name": commands[i], "value": descriptions[i]})
    }
    return embed
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function decimalToHexString(number) {
    if (number < 0) { number = 0xFFFFFFFF + number + 1 }
    return number.toString(16).toUpperCase();
}

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};
bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;
    const { d: data } = event;
    const user = bot.users.get(data.user_id);
    const channel = bot.channels.get(data.channel_id) || await user.createDM();
    if (channel.messages.has(data.message_id)) return;
    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);
    bot.emit(events[event.t], reaction, user);
});

function testCommand(message) {
    if (message.author.id != testacc) {
        message.channel.send("``sorry that is being worked on``")
        return
    }
}

bot.on('ready', () => {
    console.log('I am ready!');
    bot.user.setPresence({ game: { name: 'I turned on !!', type: 0 } }); //playing game
    wait(5000)
    bot.user.setPresence({ game: { name: 'your every move', type: 3 } });
    bot.user.setUsername("Detective Vetomo");
});

bot.on('message', message => {
    var sender = message.author;
    if (message.author.bot) return;
    const args = message.content.split(" ");
    let rip = message.content.toLowerCase()
    let guild = message.guild
    if (rip.startsWith(PREFIX + "ping")) {
        message.channel.send(`Pong! ${new Date().getTime() - message.createdTimestamp}ms`)
    }
    if (rip.startsWith(PREFIX + "randomhex")) {
        let color = getRandomInt(16777215)
        var embed = basicEmbed(color, `#${decimalToHexString(color)}`)
        message.channel.send({ embed });
    }
    if (rip.startsWith(PREFIX + "rate")) {
        const thingToRate = args.join(" ");
        var ratedThing = thingToRate.substr(5);
        var embed = basicEmbed(65535, `I would rate ${ratedThing} ${getRandomInt(10)} out of 10!`)
        message.channel.send({ embed });
    }
    if (rip.startsWith(PREFIX + "8ball")) {
        if (args[1] != null) {
            var embed = basicEmbed(122353, `${eightBall[Math.floor(Math.random() * eightBall.length).toString(16)]}`)
            message.channel.send({ embed });
        } else message.channel.send("where is the question? \n```Correct usage: !8ball question```");
    }
    if (rip.startsWith(PREFIX + "coinflip")) {
        var embed = basicEmbed(16776448, `${coinFlip[Math.floor(Math.random() * coinFlip.length).toString(16)]}`)
        message.channel.send({ embed });
    }
    if (message.content.startsWith(PREFIX + "userinfo")) {
        let guild = message.guild;
        if (message.mentions.users.array().toString().length >= 1) {
            var person = message.mentions.users.first()
        } else {
            var person = message.author
        }
        let color = message.guild.member(person).displayColor
        var embed = pfpEmbed(color, ["Display Name", "User ID", "Roles", "Top Role Colour", "Joined"], [`${message.guild.member(person).displayName}`,`${person.id}`,`${message.guild.member(person).roles.array().toString().substr(0, 1024)}`,`${message.guild.member(person).displayHexColor}`,`${message.guild.member(person).joinedAt.toUTCString()}`], `Info About ${person.username}`, `${person.avatarURL}`)
        message.channel.send({ embed });
    }
    if (message.content.startsWith(PREFIX + "send")) {
        if (message.author.id === '270017125815418901') {
            const sayMessage = args.join(" ");
            var useContent = sayMessage.substr(5);
            var attachments = (message.attachments).array()
            message.delete().catch(O_o => { })
            if (message.attachments.array().length >= 1) {
                message.channel.send(`${useContent}`)
                attachments.forEach(function (attachment) { message.channel.send({ file: `${attachment.url}` }) })
            }else if (message.attachments.array().length <= 0) { message.channel.send(`${useContent}`) }
            message.channel.stopTyping()
        } else
            message.channel.send("non that only spark");
    }
    if (rip.startsWith(PREFIX + "avatar")) {
        if (message.mentions.users.array().toString().length >= 1) {
            var pfp = message.mentions.users.first().avatarURL
            message.channel.send({ files: [{ attachment: pfp, name: `avatar${pfp.slice(0, -10).substr(pfp.slice(0, -10).length - 4)}` }] })
        } else {
            var pfp = message.author.avatarURL
            message.channel.send({ files: [{ attachment: pfp, name: `avatar${pfp.slice(0, -10).substr(pfp.slice(0, -10).length - 4)}` }] })
        }
    }
    if (rip.startsWith(PREFIX + "morse")) {
        var chars = { ' ': '/', 'a': '.- ', 'b': '-... ', 'c': '-.-. ', 'd': '-.. ', 'e': '. ', 'f': '..-. ', 'g': '--. ', 'h': '.... ', 'i': '.. ', 'j': '.--- ', 'k': '-.- ', 'l': '.-.. ', 'm': '-- ', 'n': '-. ', 'o': '--- ', 'p': '.--. ', 'q': '--.- ', 'r': '.-. ', 's': '... ', 't': '- ', 'u': '..- ', 'v': '...- ', 'w': '.-- ', 'x': '-..- ', 'y': '-.-- ', 'z': '--.. ', '1': '.---- ', '2': '..--- ', '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ', '7': '--... ', '8': '---.. ', '9': '----. ', '0': '----- ' };
        var s = rip.substr(7);
        s = s.replace(/[abcdefghijklmnopqrstuvwxyz1234567890 ]/g, m => chars[m]);
        message.channel.send(`${s}`)
    }
    if (rip.startsWith(PREFIX + "emote")) {
        var chars = { ' ': '⬜', 'a': '🅰 ', 'b': '🅱 ', 'c': '🇨 ', 'd': '🇩 ', 'e': '🇪 ', 'f': '🇫 ', 'g': '🇬 ', 'h': '🇭 ', 'i': '🇮 ', 'j': '🇯 ', 'k': '🇰 ', 'l': '🇱 ', 'm': '🇲 ', 'n': '🇳 ', 'o': '🅾 ', 'p': '🇵 ', 'q': '🇶 ', 'r': '🇷 ', 's': '🇸 ', 't': '🇹 ', 'u': '🇺 ', 'v': '🇻 ', 'w': '🇼 ', 'x': '🇽 ', 'y': '🇾 ', 'z': '🇿 ' };
        var s = rip.substr(7);
        s = s.replace(/[abcdefghijklmnopqrstuvwxyz ]/g, m => chars[m]);
        message.channel.send(`${s}`)
    }
    if (message.content.startsWith(PREFIX + "tools")) {
        let color = getRandomInt(16777215)
        var embed = richEmbed(color, ["🔍", "❓", "<:inv:486093327662448650>", "🔨"], [`Looks through the room and adds anything that gets found to your evidence archive`,`Stuck? Detective Vetomo will look around to help pick up some extra clues (Can only be used twice)`,`Think you can combine some of your evidence? press this and then dm the evidence id to Vetomo, and if you can, you will!`,`think you've solved the mystery? go to the profile for the person youre accusing and press this, then answer the questions sent by the bot and see if youre right!`], `Tools`)
        message.channel.send({ embed });
    }
    if (message.content.startsWith(PREFIX + "atc")) {
        let color = getRandomInt(16777215)
        var embed = richEmbed(color, ["Room ID","Summary of room"], ["atc","-object sitting on chair near back\n-broken drawers\n-camera on ground"], `Information on the attic`)
        message.channel.send({ embed });
    }
     if (message.content.startsWith(PREFIX + "pc823")) {
         let color = getRandomInt(16777215)
         var embed = richEmbed(color, ["Found In", "Evidence ID", "Suspects Present", "Hidden Data", "Information"], [`<#484294432204521472>`,`pc_823`,`<#484532378572816394>, <#484532686032076802>`,`Conversation audio`,`Audio tape of a conversation between poot and cate, conversation is below`], `Info About The Evidence Above`)
         message.channel.send({ embed }).then(m => (
             m.react(inv)
         ))
     }
     if (message.content.startsWith(PREFIX + "cm192")) {
         let color = getRandomInt(16777215)
         var embed = richEmbed(color, ["Found In", "Evidence ID", "Suspects Present", "Hidden Data", "Information"], [`<#484294432204521472>`,`cm_192`,`<#484532310881075201>`,`None`,`Image of Nakpin found in the attic, confirming that they were in the attic at the time of the crime`], `Info About The Evidence Above`)
         message.channel.send({ embed }).then(m => (
             m.react(inv)
         ))
     }
});

async function accuse(emoji, reaction, user) {
    if (reaction.emoji.name === emoji) {
        if (user.bot) return
        let guild = reaction.message.guild
        let member = guild.member(user)
        var rooms = ['Attic','Bedroom','Bathroom','Kitchen','Living Room','Basement']
        var roomids=['atc','bdr','btr','ktc','lvr','bsm']
        var evidence = ['conversation between poot and cate','polaroid of nakpin','boombox screw','muddy shoe print']
        var evids = ['pc_823','cm_192','bm_428','ss_729']
        var chosenEvidence = []
        var accused = guild.channels.get(reaction.message.channel.id).name
        chosenEvidence.push(accused)
        user.send(`you are accusing \`${accused}\` of stealing the candy\nplease send the id of the room that you think they stole it from\n\`you will have exactly 30 seconds to submit each of your answers\``).then(async function(room){
            var roomvalue = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
            var roomCheck = roomvalue.first().content
            while (roomids.includes(roomCheck.toLowerCase()) != true) { 
                room.channel.send('`that is not a valid response, please input a valid room id`')
                roomvalue = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
                roomCheck = roomvalue.first().content
            }
            chosenEvidence.push(rooms[roomids.indexOf(roomCheck.toLowerCase())])
            room.channel.send(`you have chosen the \`${chosenEvidence[1]}\` as the room that the event took place`)
            user.send(`please present the id of your first piece of evidence`).then(async function(){
                var answer1 = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
                var ev1Check = answer1.first().content
                while (evids.includes(ev1Check.toLowerCase()) != true) { 
                    answer.channel.send('`that is an invalid response, please input a valid room id`')
                    answer1 = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
                    ev1Check = answer1.first().content
                }
                chosenEvidence.push(evidence[evids.indexOf(ev1Check.toLowerCase())])
                room.channel.send(`you have chosen:\`${chosenEvidence[2]}\` as your first piece of evidence`)
                room.channel.send(`please present the id of your second piece of evidence`).then(async function(){
                    var answer2 = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
                    var ev2Check = answer2.first().content
                    while ((evids.includes(ev2Check.toLowerCase()) != true)||(chosenEvidence.includes(evidence[evids.indexOf(ev2Check.toLowerCase())]) === true)) { 
                        room.channel.send('`that is either an invalid response or you have used this already, please input a valid room id`')
                        answer2 = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
                        ev2Check = answer2.first().content
                    }
                    chosenEvidence.push(evidence[evids.indexOf(ev2Check.toLowerCase())])
                    room.channel.send(`you have chosen:\`${chosenEvidence[3]}\` as your second piece of evidence`)
                    room.channel.send(`please present the id of your third piece of evidence`).then(async function(){
                        var answer3 = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
                        var ev3Check = answer3.first().content
                        while ((evids.includes(ev3Check.toLowerCase()) != true)||(chosenEvidence.includes(`${evidence[evids.indexOf(ev3Check.toLowerCase())]}`) === true)) { 
                            room.channel.send('`that is either an invalid response or you have used this already, please input a valid room id`')
                            answer3 = await room.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
                            ev3Check = answer3.first().content
                        }
                        chosenEvidence.push(evidence[evids.indexOf(ev3Check.toLowerCase())])
                        room.channel.send(`you have chosen:\`${chosenEvidence[4]}\` as your third piece of evidence`)
                        if (chosenEvidence.includes("chris") != true) {
                            return room.channel.send("`you have gotten at least one thing incorrect`")
                        }else if (chosenEvidence.includes("Living Room") != true) {
                            return room.channel.send("`you have gotten at least one thing incorrect`")
                        } else if (chosenEvidence.includes("muddy shoe print") != true) {
                            return room.channel.send("`you have gotten at least one thing incorrect`")
                        }else if (chosenEvidence.includes("polaroid of nakpin") != true) {
                            return room.channel.send("`you have gotten at least one thing incorrect`")
                        }else if (chosenEvidence.includes("boombox screw") != true) {
                            return room.channel.send("`you have gotten at least one thing incorrect`")
                        }else {
                            var userTime = (answer3.first().createdTimestamp - bot.guilds.get('484293337323667467').member(answer3.first().author).joinedTimestamp).toString().slice(0,-3)
                            bot.guilds.get('484293337323667467').channels.get('485205101913571329').send(`<@${user.id}> has won! their time was: ${userTime} seconds`, { files: [{ attachment: user.avatarURL, name: `${userTime} ${user.id}${user.avatarURL.slice(0, -10).substr(user.avatarURL.slice(0, -10).length - 4)}` }]})
                            answer3.first().author.send("you won teehee")
                        }
                    })
                })
            })
        })
    } else return
}

function findEvidence(channel, roleid, emoji, reaction, user, found) {
    if (reaction.emoji.name === emoji) {
        if (user.bot) return;
        let guild = reaction.message.guild;
        let member = guild.member(user);
        if (reaction.message.channel != bot.channels.get(channel)) {
            return;
        }
        if (member.roles.has(roleid)) {
            return
        } else {
            user.send(`You have found: \`${found}\``)
            member.addRole(roleid)
        }
    }
}

async function evidenceCheck(member, answer,correctanswer, object, role){
    if (member.roles.has(role)) return member.user.send('`you have already used all possible evidence on this item.`')
    if (answer === correctanswer) {
        member.user.send(`\`you have unlocked ${object}\``)
        member.addRole(role)
    }else{
        member.user.send("`this is not the correct evidence item to use.`")
    }
}

async function useEvidence(reaction, channel, user, guild, member){
    if (user.bot) return
    user.send('please send the evidence id that you would like to try use on this.\nyou have 30 seconds to respond').then(async function(newmsg){
        var input = await newmsg.channel.awaitMessages(response => response.author.id === user.id, {max:1, time:30000, errors:['time']})
        if (!input.first()) return newmsg.channel.send('`request cancelled, too much time taken`')
        var answer = input.first().content.toLowerCase()
        if (channel.id === bm428){
            evidenceCheck(member,answer,"cm_192","taco",testrole)
        }else if (channel.id === aqua){
            evidenceCheck(member,answer,"dp_475","knowledge about the attic note and disney pen",enf)
        } else if (channel.id === runaway) {
            user.send('sex')
        }else{
            user.send('`you can not use any evidence on this.`')
        }
    })
}

bot.on('messageReactionAdd', async (reaction, user) => {
    let guild = reaction.message.guild
    let member = guild.member(user)
    findEvidence(attic, '486089032388837387', "🔍", reaction, user, "a tape recorder and a polaroid photo")
    if (reaction.emoji.name === "inv"){
        useEvidence(reaction, reaction.message.channel, user, guild, member)
    }
    accuse("🔨", reaction, user)
});

// Sneaky Sneaky Token. Dont Share Kiddos
bot.login(process.env.BOT_TOKEN);
