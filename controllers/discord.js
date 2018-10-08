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
        console.log('I am sending to ', + config.active)
        switch(config.active) {
            case 'watson':
                watson(message.content.substr(1),function done(err,callback)
                {
                    message.channel.send(callback);
                });
            case 'aws' :
                message.channel.send('AWS connector in developement');
        }
    
    }
});
    



module.exports = (text) => {
    client.channels.get(config.discord.channelId).send(text);
 };