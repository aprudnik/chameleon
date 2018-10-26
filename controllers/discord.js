const Discord = require("discord.js");
var auth = require('./auth.json');
var config = require('../config')
const getIntents = require('./pathSelection')
const dialog = require('./dialog')
const test = require('../test')

const client = new Discord.Client();

client.login(auth.token);
    
client.on("ready", () => {
    console.log("I am ready!");
});
    
client.on("message", (message) => {
    if (message.content.startsWith("!")) {
        getIntents(config.active, message.content, function (err, body){
            console.log("Discord log : ",body)
            // dialog(body,resMessage => {message.channel.send(resMessage)})
            test(body,resMessage => {message.channel.send(resMessage)})
        })
    } 
});
    

module.exports = (text) => {
    client.channels.get(config.discord.channelId).send(text);
 };