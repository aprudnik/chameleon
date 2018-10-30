const Discord = require("discord.js");
var auth = require('../conf/auth.json');
var config = require('../conf/config')
const getIntents = require('./pathSelection')
const dialog = require('./dialog')

const client = new Discord.Client();

client.login(auth.token);
    
client.on("ready", () => {
    console.log("I am ready!");
});
    
client.on("message", (message) => {
    if (message.content.startsWith("!")) {
        getIntents(config.active, message.content, function (err, body){
            console.log("Discord log : ",body)
            dialog(body,resMessage => {message.channel.send(resMessage)})
        })
    } 
});
    

module.exports = (text) => {
    client.channels.get(config.discord.channelId).send(text);
 };