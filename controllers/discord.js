var watson = require('../controllers/watson')
const Discord = require("discord.js");
var auth = require('./auth.json');
var config = require('../config')
const getIntents = require('./pathSelection')
const dialog = require('./dialog')

const client = new Discord.Client();

client.login(auth.token);
    
client.on("ready", () => {
    console.log("I am ready!");
});
    
client.on("message", (message) => {
    if (message.content.startsWith("!")) {
        getIntents(config.active, req.query, function (err, body){
            dialog(body.intent,resMessage => {message.channel.send(resMessage)})
        })
    } 
});
    

module.exports = (text) => {
    client.channels.get(config.discord.channelId).send(text);
 };