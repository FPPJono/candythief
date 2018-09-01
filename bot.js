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

//channels
const memesChannel = '450243552681918465'
const hof = '450244347137359874'
const artChannel = '452219856712892416'
const suggestChannel = '450568346824343555'
const welcome = '450165137001807873'


//roles
const admin = '450156424694071296'
const beerbongs = '450155434356113418'
const stoney = '450155315095142413'
const august26 = '450155482263584768'
const announcements = '453402930763268098'

//Role Tiers
const fans = '452239200444743700' //Tier 1
const noticeMe = '452232318921211904' //Tier 2
const rockstar = '452232317390290955' //Tier 3
const goFlex = '452232316295708673' //Tier 4
const hollywoodDreamers = '452232315653980171' //Tier 5

//Song Roles


//lists
var eightBall = ["I would say..... yes!", "Probably not", "heck maybe, idk", "I dont think so", "eh, probably", "hmmm.... maybe not", "*concentrate*, and try again", "look man im just a bot go ask someone who cares", "those who ask will get their answer eventually, try again", "haha! yes!", "hah, nope"]
var coinFlip = ["The coin landed on heads!", "The coin landed on tails"]

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

async function gifScore(role, color, person, message, height, name) {
    var size = (600 / name.length)
    if (size > 50){
        size = 50
    }
    var frames = []
    var i = 0
    var frameCount = 0
    await gifFrames({url:person.displayAvatarURL, frames:'all', outputType: 'png'}).then(function(frameData){
        frameCount = frameData.length
    })
    message.channel.send(`\`\`sending animated score card, estimated wait time ${frameCount * 1.5} seconds\`\``)
    while(i < frameCount) {
        wait(1500)
        await gifFrames({url:person.displayAvatarURL, frames:i, outputType: 'png'}).then(function(frameData){
            frameData[0].getImage().pipe(fs.createWriteStream(`scorecards/pfp.png`))
        })
        await PImage.decodePNGFromStream(fs.createReadStream(`scorecards/${role}.png`)).then((img) => {
            var img2 = PImage.make(500,500);
            var c = img2.getContext('2d');
            c.drawImage(img,
                0, 0, img.width, img.height, // source dimensions
                0, 0, 500, 500               // destination dimensions
            );
            var ctx = c
            var fnt = PImage.registerFont('scorefont.ttf', 'Score Font')
            fnt.load(() => {
                ctx.fillStyle = color;
                ctx.font = `${size}pt 'Score Font'`;
                ctx.fillText(`${name.toUpperCase()}`, 135, 80);
                ctx.font = "35pt 'Score Font'"
                ctx.fillText("this", 14, 221)
                ctx.fillText("currently", 14, 292)
                ctx.fillText("doesn't", 14, 365)
                ctx.fillText("work", 14, 435)
                ctx.fillRect(340, height, 150, 150)
                PImage.decodePNGFromStream(fs.createReadStream(`scorecards/pfp.png`)).then((pfp) => {
                    c.drawImage(pfp,
                        0, 0, pfp.width, pfp.height,
                        15, 15, 110, 110
                   )
                    var namenum = getRandomInt(1000000000000)
                    PImage.encodePNGToStream(img2,fs.createWriteStream(`scorecards/score${namenum.toString()}.png`)).then(() => {
                        console.log(`frame ${namenum} of ${name}'s score has been made`);
                        frames.push(`scorecards/score${namenum}.png`)
                    });
                })
            });
        });
        var i = i + 1
        console.log(`i value is now ${i}`)
    }
    const outputGifFile = 'scorecards/score.gif'
    await GifCreationService.createAnimatedGifFromPngImages(frames, outputGifFile, {repeat:true, fps:24, quality:5})
    .then(outputGifFile => {
        console.log(`${person.username}'s score has just been checked, id:${person.id}`)
    })
    message.channel.send({files:[{attachment: 'scorecards/score.gif', name:'score.gif'}] })
}

async function scorecard(role, color, person, message, height, name) {
    if ((person.displayAvatarURL.includes("png"))||(person.displayAvatarURL.includes("jpg"))){
        await download.image({url: person.displayAvatarURL, dest:`scorecards/pfp.png`})
    }else if(person.displayAvatarURL.includes("gif")){
        gifScore(role,color,person,message,height,name)
        return;
    }
    var size = (600 / name.length)
    if (size > 50){
        size = 50
    }
    PImage.decodePNGFromStream(fs.createReadStream(`scorecards/${role}.png`)).then((img) => {
        var img2 = PImage.make(500,500);
        var c = img2.getContext('2d');
        c.drawImage(img,
            0, 0, img.width, img.height, // source dimensions
            0, 0, 500, 500               // destination dimensions
        );
        var ctx = c
        var fnt = PImage.registerFont('scorefont.ttf', 'Score Font')
        fnt.load(() => {
            ctx.fillStyle = color;
            ctx.font = `${size}pt 'Score Font'`;
            ctx.fillText(`${name.toUpperCase()}`, 135, 80);
            ctx.font = "35pt 'Score Font'"
            ctx.fillText("this", 14, 221)
            ctx.fillText("currently", 14, 292)
            ctx.fillText("doesn't", 14, 365)
            ctx.fillText("work", 14, 435)
            ctx.fillRect(340, height, 150, 150)
            PImage.decodePNGFromStream(fs.createReadStream(`scorecards/pfp.png`)).then((pfp) => {
                c.drawImage(pfp,
                    0, 0, pfp.width, pfp.height,
                    15, 15, 110, 110
               )
                PImage.encodePNGToStream(img2,fs.createWriteStream('scorecards/score.png')).then(() => {
                    console.log(`${person.username}'s score has just been checked, id:${person.id}`);
                    message.channel.send({files:[{attachment: 'scorecards/score.png', name:'score.png'}] })
                });
            })
        });
    });
}

function customRole(message, color, name, x, file) {
    PImage.decodePNGFromStream(fs.createReadStream(`scorecards/${file}role.png`)).then((img) => {
        var img2 = PImage.make(500,250);
        var c = img2.getContext('2d');
        c.drawImage(img,
            0, 0, img.width, img.height, // source dimensions
            0, 0, 500, 250               // destination dimensions
        );
        var ctx = c
        var fnt = PImage.registerFont('scorefont.ttf', 'Score Font')
        fnt.load(() => {
            ctx.fillStyle = color
            ctx.font = "40pt 'Score Font'";
            ctx.fillText(`YOU HAVE CLAIMED`, 50, 80)
            ctx.fillText("THE", 200, 120)
            ctx.fillText("ROLE", 190, 200)
            ctx.font = "30pt 'Score Font'"
            ctx.fillText(`${name.toUpperCase()}`, x, 153);
            ctx.fillRect(x,157,(name.toString().length * 18.5),3);
            PImage.encodePNGToStream(img2,fs.createWriteStream('scorecards/role.png')).then(() => {
                message.channel.send({files:[{attachment: 'scorecards/role.png', name:'role.png'}] })
            });
        });
    });   
}

function testCommand(message) {
    if (message.author.id != testacc) {
        message.channel.send("``sorry that is being worked on``")
        return
    }
}

async function welcomecard(person, guild) {
    if ((person.displayAvatarURL.includes("png"))||(person.displayAvatarURL.includes("jpg"))){
        await download.image({url: person.displayAvatarURL, dest:`scorecards/welcomepfp.png`})
    }else if(person.displayAvatarURL.includes("gif")){
        await gifFrames({url:person.displayAvatarURL, frames:0, outputType: 'png'}).then(function(frameData){
            frameData[0].getImage().pipe(fs.createWriteStream(`scorecards/welcomepfp.png`))
        })
    }
    PImage.decodePNGFromStream(fs.createReadStream(`scorecards/welcomeCard.png`)).then((img) => {
        var size = (530 / person.username.toString().length)
        if (size > 40){
            size = 40
        }
        var img2 = PImage.make(500,250);
        var c = img2.getContext('2d');
        c.drawImage(img,
            0, 0, img.width, img.height, // source dimensions
            0, 0, 500, 250               // destination dimensions
        );
        var ctx = c
        var fnt = PImage.registerFont('scorefont.ttf', 'Score Font')
        fnt.load(() => {
            ctx.fillStyle = '#000000';
            ctx.font = `${size}pt 'Score Font'`;
            ctx.fillText(`${person.username}`, 134, 158);
            ctx.fillStyle = '#ffffff'
            ctx.font = "20pt 'Score Font'";
            ctx.fillText(`Member #${guild.memberCount}`, 324, 207);
            PImage.decodePNGFromStream(fs.createReadStream(`scorecards/welcomepfp.png`)).then((pfp) => {
                c.drawImage(pfp,
                    0, 0, pfp.width, pfp.height,
                    52, 44, 72, 72
                )
                PImage.encodePNGToStream(img2,fs.createWriteStream('scorecards/welcome.png')).then(() => {
                    console.log(`${person.username} has just joined the server`);
                    guild.channels.get(welcome).send({files:[{attachment: 'scorecards/welcome.png', name:'welcome.png'}] })
                    function message(channel){
                        channel.send(`Welcome <@${person.id}> to Posty's Rockstar Club!\nHere's a short list of channels you'll want to check out:\n<#450165074938691585> it's just the rules for the server but its important you know them\n<#450423170105868323> the commands channel!\nFor a list of commands just do !help\n<#450136391351926796> this is the general chat, its where most people hang out\n\nPlease introduce yourself in this channel! We'd love to get to know you`)
                    }
                    setTimeout(message, 100, guild.channels.get(welcome))
                });
            })
        });
    });
}

bot.on('ready', () => {
    console.log('I am ready!');
    bot.user.setPresence({ game: { name: 'I turned on !!', type: 0 } }); //playing game
    wait(5000)
    bot.user.setPresence({ game: { name: 'something heck idk', type: 0 } });
    bot.user.setUsername("Leon Dechino");
});

bot.on("guildMemberAdd", async member => {
    let guild = member.guild;
    welcomecard(member.user, guild)
    let RoleMember = guild.member(member.user);
    RoleMember.addRole(beerbongs)
    RoleMember.addRole(fans)
});

bot.on("message", async message => {
    var sender = message.author;
    if (message.author.bot) return;
    const args = message.content.split(" ");
    let rip = message.content.toLowerCase()
    let guild = message.guild
    if (message.channel.type === "dm") {
        var chars = { ' ': '/', 'a': '.- ', 'b': '-... ', 'c': '-.-. ', 'd': '-.. ', 'e': '. ', 'f': '..-. ', 'g': '--. ', 'h': '.... ', 'i': '.. ', 'j': '.--- ', 'k': '-.- ', 'l': '.-.. ', 'm': '-- ', 'n': '-. ', 'o': '--- ', 'p': '.--. ', 'q': '--.- ', 'r': '.-. ', 's': '... ', 't': '- ', 'u': '..- ', 'v': '...- ', 'w': '.-- ', 'x': '-..- ', 'y': '-.-- ', 'z': '--.. ', '1': '.---- ', '2': '..--- ', '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ', '7': '--... ', '8': '---.. ', '9': '----. ', '0': '----- ' };
        var s = rip
        s = s.replace(/[abcdefghijklmnopqrstuvwxyz1234567890 ]/g, m => chars[m]);
        message.channel.send(`${s}`)
        return
    }
    if (message.mentions.users.array().toString().length >= 1) {
        var person = message.mentions.users.first()
    } else {
        var person = message.author
    }
    var attachedfiles = (message.attachments).array()
    if (rip.startsWith('!invert')) {
        let a = message.attachments.array().length;
        var correctURL = 'https://raw.githubusercontent.com/FPPJono/posty/master/attachmentnotfound.jpg'
        if (a >= 1) {
            if (message.attachments.array()[0].url.includes('png')||message.attachments.array()[0].url.includes('jpg')||message.attachments.array()[0].url.includes('gif')) {
                correctURL = message.attachments.array()[0].url
            } else { 
                correctURL = person.displayAvatarURL
            }
        } else {
            correctURL = person.displayAvatarURL
        }
        console.log(correctURL)
        if ((correctURL.toLowerCase().includes('png'))||(correctURL.toLowerCase().includes('jpg'))) {
            await download.image({url: correctURL, dest: 'pfp.png'})
            Jimp.read("pfp.png").then(function (image) {
                image.invert()
                     .write("tint.jpg")
                console.log("done")
            })
        }else if(correctURL.toLowerCase().includes("gif")){
            await gifFrames({url:correctURL, frames:0, outputType: 'png'}).then(function(frameData){
                frameData[0].getImage().pipe(fs.createWriteStream(`pfp.png`))
                Jimp.read("pfp.png").then(function (image) {
                    image.invert()
                         .write("tint.jpg")
                    console.log("done")
                })
            })
        }
        function tint(message){
            message.channel.send({files:[{attachment: 'tint.jpg', name:'invert.jpg'}] })
        }
        setTimeout(tint, 300, message)
    }
    if (rip.startsWith('!help')) {
        if (rip.substr(6).startsWith('random')){
            var commands = ["!randomhex", "!rate", "!coinflip", "!8ball"]
            var descriptions = ["sends a random color", "rates a thing", "flips a coin", "uses a magic 8ball"]
            var embed = richEmbed(getRandomInt(16777215), commands, descriptions, "Random Commands") 
            message.channel.send({embed})
        } else if (rip.substr(6).startsWith('converting')){
            var commands = ["!morse", "!emote"]
            var descriptions = ["converts text to morse code", "converts text to emotes"]
            var embed = richEmbed(getRandomInt(16777215), commands, descriptions, "Converting Commands")
            message.channel.send({embed})
        } else if (rip.substr(6).startsWith('staff')){
            var commands = ["!send [message]", "!warn @person [warning]", "!playing [thing]", "!watching [thing]", "!listening [thing]", "!clear [number from 2-100]"]
            var descriptions = ["sends a message", "sends warning to member", "sets playing status", "sets watching status", "sets listening status", "deletes certain amount of messages"]
            var embed = richEmbed(getRandomInt(16777215), commands, descriptions, "Staff Commands")
            message.channel.send({embed})
        } else if (rip.substr(6).startsWith('info')){
            var commands = ["!ping", "!userinfo (@person)", "!avatar", "!suggest [suggestion]", "!score", "!perkinfo [perk]"]
            var descriptions = ["pings the bot", "gets info about yourself or another member", "sends current profile pic of you or person mentioned", "sends a suggestion to a staff channel", "sends the score of a person (WIP)", "sends information about a perk"]
            var embed = richEmbed(getRandomInt(16777215), commands, descriptions, "Info Commands")
            message.channel.send({embed})
        } else if (rip.substr(6).startsWith('roles')){
            var commands = ["!role [album]", "!announcements"]
            var descriptions = ["gives album role", "turns on/off announcements pings"]
            var embed = richEmbed(getRandomInt(16777215), commands, descriptions, "Role Commands")
            message.channel.send({embed})
        } else {
            var embed = topicEmbed(getRandomInt(16777215), "Random\nConverting\nStaff\nInfo\nRoles\nUse !help [category] to check commands from each section", "Command Sections")
            message.channel.send({embed})
        }
    }
    if (rip.startsWith('!perkinfo')) {
        if (rip.startsWith('!perkinfo n')) {
            var commands = ["name higher in member hierarchy", "access to bonus command", "new !daily background", "badge on !score"]
            var descriptions = ["makes you more *notice*able", "!image", "notice me themed", "replaces previous badge"]
            var embed = richEmbed(getRandomInt(16777215), commands, descriptions, "Notice Me")
            message.channel.send({embed})
        } else {
            var embed = topicEmbed(getRandomInt(16777215), "Notice me\nGo Flex\nRockstar\nHollywood Dreamers", "Perks")
            message.channel.send({embed})
        }
    }
    if (rip.startsWith('!score')) { 
        if (guild.member(person).nickname != null){
            if (person.username.toString().length < guild.member(person).nickname.toString().length) {
                var name = person.username.toString()
            } else var name = guild.member(person).nickname.toString()
        } else var name = person.username.toString()
        if (person.id === '246840305741987840') {
            await message.channel.send('sucky wucky 😏')
        }
        if (guild.member(person).id === testacc){
            await scorecard('sparkscore', `#${decimalToHexString(getRandomInt(16777215))}`, person, message, 340, name)
            return
        }
        if (guild.member(person).roles.has(beerbongs)) {
            await scorecard('beerbongs', '#000000', person, message, 200, name)
            return
        }
        if (guild.member(person).roles.has(august26)) {
            await scorecard('august26', '#bb001d', person, message, 340, name)
            return
        }
        if (guild.member(person).roles.has(stoney)) {
            await scorecard('stoney', '#ffffff', person, message, 208, name)
            return
        }
    }
    //level tier testing stuff
    if (rip.startsWith('!notice')) {
        if (message.author.id != testacc) return
        if (message.member.roles.has(noticeMe)) {
            message.channel.send("you already have this role")
            return
        } else if (message.member.roles.has(fans)) {
            message.member.addRole(noticeMe)
            message.channel.send("you now have the notice me role")
            message.author.send("Congratulations on getting the notice me role!\nhere are all the new perks you have:\nbedtime is 7pm")
        }
    }
    if (rip.startsWith('!rockstar')) {
        if (message.author.id != testacc) return
        if (message.member.roles.has(rockstar)) {
            message.channel.send("you already have this role")
            return
        } else if (message.member.roles.has(noticeMe)) {
            message.member.addRole(rockstar)
            message.channel.send("you now have the rockstar role")
            message.author.send("Congratulations on getting the rockstar role!\nhere are all the new perks you have:\nbedtime is 8pm")
        }else{
            message.channel.send("you must have the notice me role for this")
        }
    }
    if (rip.startsWith('!goflex')) {
        if (message.author.id != testacc) return
        if (message.member.roles.has(goFlex)) {
            message.channel.send("you already have this role")
            return
        } else if (message.member.roles.has(rockstar)) {
            message.member.addRole(goFlex)
            message.channel.send("you now have the go flex role")
            message.author.send("Congratulations on getting the go flex role!\nhere are all the new perks you have:\nbedtime is 9pm")
        }else{
            message.channel.send("you must have the rockstar role for this")
        }
    }
    if (rip.startsWith('!hollywood')) {
        if (message.author.id != testacc) return
        if (message.member.roles.has(hollywoodDreamers)) {
            message.channel.send("you already have this role")
            return
        } else if (message.member.roles.has(goFlex)) {
            message.member.addRole(hollywoodDreamers)
            message.channel.send("you now have the hollywood dreamers role")
            message.author.send("Congratulations on getting the hollywood dreamers role!\nhere are all the new perks you have:\nbedtime is 10pm")
        }else{
            message.channel.send("you must have the go flex role for this")
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
    if (rip.startsWith('!role')) {
        if (rip.startsWith('!role b')) {
            customRole(message, '#000000', "Beerbongs and Bentleys", 45, "beerbongs")
            message.member.addRole(beerbongs)
            message.member.removeRole(august26)
            message.member.removeRole(stoney)
        }
        if (rip.startsWith('!role a')) {
            customRole(message, '#bb001d', "August 26", 157, "august")
            message.member.addRole(august26)
            message.member.removeRole(stoney)
            message.member.removeRole(beerbongs)
        }
        if (rip.startsWith('!role s')) {
            customRole(message, '#ffffff', "Stoney", 185, "stoney")
            message.member.removeRole(august26)
            message.member.addRole(stoney)
            message.member.removeRole(beerbongs)
        }
    }
    if (rip.startsWith('!announcements')) {
        if (message.member.roles.has(announcements)) {
            message.member.removeRole(announcements)
            message.channel.send("```You will no longer be pinged in any announcements posts```")
        } else {
            message.member.addRole(announcements)
            message.channel.send("```You will now be pinged in all important announcements posts```")
        }
    }
    if (rip.startsWith(PREFIX + "playing")) {
        if (message.member.roles.has(admin)) {
            let content = args.join(" ")
            var useContent = content.substr(8);
            bot.user.setPresence({ game: { name: useContent, type: 0 } });
            console.log(`${sender.username} just changed the game to ${useContent}`)
        } else
            message.channel.send("sorry, that command is for staff only")
                .then(m => m.delete(5000));
    }
    if (rip.startsWith(PREFIX + "listening")) {
        if (message.member.roles.has(admin)) {
            let content = args.join(" ")
            var useContent = content.substr(10);
            bot.user.setPresence({ game: { name: useContent, type: 2 } });
            console.log(`${sender.username} made me listening to ${useContent}`)
        } else
            message.channel.send("sorry, that command is for staff only")
                .then(m => m.delete(5000));
    }
    if (rip.startsWith(PREFIX + "watching")) {
        if (message.member.roles.has(admin)) {
            let content = args.join(" ")
            var useContent = content.substr(9);
            bot.user.setPresence({ game: { name: useContent, type: 3 } });
            console.log(`${sender.username} just made the bot watching ${useContent}`)
        } else
            message.channel.send("sorry, that command is for staff only")
                .then(m => m.delete(5000));
    }
    if (message.channel.id === artChannel) {
        let a = message.attachments.array().length;
        if (a >= 1) {
            message.react('👌')
        }
    }
    if (message.channel.id === memesChannel) {
        let a = message.attachments.array().length;
        if (a >= 1) {
            message.react('👌')
            message.react('👎')
        }
        if (rip.includes('http')) {
            message.react('👌')
            message.react('👎')
        }
    }
    if (message.channel.id === hof) {
        let a = message.attachments.array().length;
        if (a >= 1) {
            message.react('👌')
            message.react('👎')
        }
        if (rip.includes('http')) {
            message.react('👌')
            message.react('👎')
        }
    }
    if (rip.startsWith(PREFIX + "randomhex")) {
        let color = getRandomInt(16777215)
        var embed = basicEmbed(color, `#${decimalToHexString(color)}`)
        message.channel.send({ embed });
    }

    if (rip.startsWith(PREFIX + "send")) {
        if (message.member.roles.has(admin)) {
            const sayMessage = args.join(" ");
            var useContent = sayMessage.substr(5);
            var attachments = (message.attachments).array()
            message.delete().catch(O_o => { })
            if (message.attachments.array().length >= 1) {
                message.channel.send(`${useContent}`)
                attachments.forEach(function (attachment) { message.channel.send({ file: `${attachment.url}` }) })
            }
            if (message.attachments.array().length <= 0) { message.channel.send(`${useContent}`) }
        } else
            message.channel.send("sorry thats for staff only");
    }
    if (rip.startsWith(PREFIX + "rate")) {
        const thingToRate = args.join(" ");
        var ratedThing = thingToRate.substr(5);
        var embed = basicEmbed(65535, `I would rate ${ratedThing} ${getRandomInt(10)} out of 10!`)
        message.channel.send({ embed });
    }
    if (rip.startsWith(PREFIX + "clear")) {
        if (message.member.roles.has(admin)) {
            message.delete()
            let messagecount = parseInt(args[1]) || 1;
            if (messagecount > 100) return;
            if (messagecount < 2) return;
            message.channel.fetchMessages({ limit: Math.min(messagecount + 1, 100) })
            message.channel.bulkDelete(messagecount)
                .then(() => {
                    var embed = basicEmbed(123732, `:white_check_mark: Deleted ${messagecount} messages.`)
                    message.channel.send({ embed })
                        .then(m => m.delete(5000));
                })
        } else
            message.channel.send("sorry thats for staff only :/")
                .then(m => m.delete(5000));
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
    if (rip.startsWith(PREFIX + "warn")) {
        if (message.member.roles.has(admin)) {
            let guild = message.guild;
            let warning = message.content.substr(28)
            guild.member(message.mentions.users.first()).send(`you have been warned for: \`${warning}\` Please improve your behaviour or you may be kicked or banned from this server in the future.`)
        } else message.channel.send("sorry that command is for staff only");
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
    if (rip.startsWith(PREFIX + "suggest")) {
        let guild = message.guild;
        let suggestion = message.content.substr(8)
        let color = message.guild.member(message.author).displayColor
        message.delete()
        message.channel.send(`\`\`\`Thank you for your suggestion!\`\`\``)
            .then(m => m.delete(5000));
        const embed = {
            "description": `${message.author.username} has suggested the change/modification below:\n${suggestion}`,
            "color": color,
            "thumbnail": {
                "url": `${message.author.avatarURL}`
            },
            "author": {
                "name": "The Suggestion Box",
                "icon_url": "https://github.com/FPPJono/posty/blob/master/post-malone-youtube-640x407.jpg?raw=true"
            }
        };
        guild.channels.get(suggestChannel).send({ embed });
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
