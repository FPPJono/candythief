//bot requirements
const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = "!";
const fs = require('fs')
const PNG = require('pngjs')
const request = require('request')
const async = require("async")
var gifFrames = require('gif-frames')
var gameMessage = new Function('return true')
const download = require('image-downloader')
const sheetsu = require('sheetsu-node')
const GifCreationService = require('gif-creation-service')
const Jimp = require('jimp')
const sizeOf = require('image-size')

var PImage = require('pureimage');
var img1 = PImage.make(500,500);
var tmp = require('tmp')

//Bot Code

//me
const testacc = '270017125815418901'


//Song Roles

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

async function scorecard(person, message) {
    if ((person.displayAvatarURL.includes("png"))||(person.displayAvatarURL.includes("jpg"))){
        await download.image({url: person.displayAvatarURL, dest:`scorecards/pfp.png`})
    }else if(person.displayAvatarURL.includes("gif")){
        await gifFrames({url:person.displayAvatarURL, frames:0, outputType: 'png'}).then(function(frameData){
            frameData[0].getImage().pipe(fs.createWriteStream(`scorecards/pfp.png`))
        })
    }
    var size = (600 / name.length)
    if (size > 50){
        size = 50
    }
    PImage.decodePNGFromStream(fs.createReadStream(`scorecards/welcomeCard.png`)).then((img) => {
        var img2 = PImage.make(736,466);
        var c = img2.getContext('2d');
        c.drawImage(img,
            0, 0, img.width, img.height, // source dimensions
            0, 0, 736, 466              // destination dimensions
        );
        var ctx = c
        var fnt = PImage.registerFont('scorefont.ttf', 'Score Font')
        fnt.load(() => {
            ctx.fillStyle = '#000000';
            ctx.font = `${size}pt 'Score Font'`;
            ctx.fillText(`test`, 135, 80);
            ctx.font = "35pt 'Score Font'"
            ctx.fillText("this", 14, 221)
            ctx.fillText("currently", 14, 292)
            ctx.fillText("doesn't", 14, 365)
            ctx.fillText("work", 14, 435)
            PImage.decodePNGFromStream(fs.createReadStream(`scorecards/pfp.png`)).then((pfp) => {
                c.drawImage(pfp,
                    0, 0, pfp.width, pfp.height,
                    15, 15, 110, 110
               )
                PImage.encodePNGToStream(img2,fs.createWriteStream('scorecards/score.png')).then(() => {
                    message.channel.send({files:[{attachment: 'scorecards/score.png', name:'score.png'}] })
                });
            })
        });
    });
}

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
    bot.user.setUsername("Candy Detective");
});

bot.on("message", async message => {
    var sender = message.author;
    if (message.author.bot) return;
    const args = message.content.split(" ");
    let rip = message.content.toLowerCase()
    let guild = message.guild
    if (message.channel.type === "dm") {
        return
    }
    if (message.mentions.users.array().toString().length >= 1) {
        var person = message.mentions.users.first()
    } else {
        var person = message.author
    }
    var attachedfiles = (message.attachments).array()
    if (rip.startsWith('!score')) { 
        if (person.id === '246840305741987840') {
            await message.channel.send('sucky wucky 😏')
        }
        if (guild.member(person).id === testacc){
            await scorecard(person, message)
            return
        }
    }
})

bot.on('message', message => {
    var sender = message.author;
    if (message.author.bot) return;
    const args = message.content.split(" ");
    let rip = message.content.toLowerCase()
    let guild = message.guild
    if (message.channel.type === "dm") return
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
    if (rip.startsWith(PREFIX + "userinfo")) {
        let guild = message.guild;
        if (message.mentions.users.array().toString().length >= 1) {
            var person = message.mentions.users.first()
        } else {
            var person = message.author
        }
        let color = message.guild.member(person).displayColor
        const embed = {
            "color": color,
            "thumbnail": {
                "url": `${person.avatarURL}`
            },
            "author": {
                "name": `${person.username}`,
                "icon_url": `${person.avatarURL}`
            },
            "fields": [
                {
                    "name": "Display name",
                    "value": `${message.guild.member(person).displayName}`
                },
                {
                    "name": "User ID",
                    "value": `${person.id}`
                },
                {
                    "name": "Roles",
                    "value": `${message.guild.member(person).roles.array().toString().substr(0, 1024)}`
                },
                {
                    "name": "Top Role Color",
                    "value": `${message.guild.member(person).displayHexColor}`
                },
                {
                    "name": "Joined",
                    "value": `${message.guild.member(person).joinedAt.toUTCString()}`
                }
            ]
        };
        message.channel.send({ embed });
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
});

// Sneaky Sneaky Token. Dont Share Kiddos
bot.login(process.env.BOT_TOKEN);