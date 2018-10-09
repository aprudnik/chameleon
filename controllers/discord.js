var watson = require('../controllers/watson')
const Discord = require("discord.js");
var auth = require('./auth.json');
var config = require('../config')

const client = new Discord.Client();

client.login(auth.token);
    
client.on("ready", () => {
    console.log("I am ready!");
});
    
client.on("message", (message) => {
    if (message.content.startsWith("!")) {
        console.log('I am sending to ' + config.active)
        await config.active
        switch(config.active) {
            case 'watson':
                watson(message.content.substr(1),function done(err,callback)
                {
                    message.channel.send(callback.output.generic[0].text);
                });
                break;
            case 'aws' :
                console.log('How did I got here? ' + config.active);
                message.channel.send('AWS connector in developement');
                break;
        }
    
    }
});
    



module.exports = (text) => {
    client.channels.get(config.discord.channelId).send(text);
 };