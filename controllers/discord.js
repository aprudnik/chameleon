const Discord = require("discord.js");
var config = require('../conf/config')
const getIntents = require('./pathSelection')
const dialog = require('./dialog')

const client = new Discord.Client();

client.login(config.discord.token);
    
client.on("ready", () => {
    console.log("I am ready!");
});
    
client.on("message", (message) => {
    if (message.content.startsWith("!")) {
        message.content = message.content.substr(1)
        getIntents(config.active, message.content, function (err, body){
            console.log("Discord log : ",body, message.content)
            dialog(body, message["author"].id, resMessage => {message.channel.send(resMessage)})
        })
    } 
});
    

module.exports = (text) => {
    client.channels.get(config.discord.channelId).send(text);
 };