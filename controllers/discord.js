var watson = require('../controllers/watson')

const Discord = require("discord.js");

var auth = require('./auth.json');

const client = new Discord.Client();

client.login(auth.token);
    
client.on("ready", () => {
    console.log("I am ready!");
});
    
client.on("message", (message) => {
    if (message.content.startsWith("!")) {
        watson(message.content.substr(1),function done(err,callback)
                {
                    message.channel.send(callback);
                })

    
    }
});
    



module.exports = (text) => {
    client.channels.get('497380218701611011').send(text);
 };