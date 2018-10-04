const Discord = require("discord.js");

var auth = require('./auth.json');

const client = new Discord.Client();
    
client.on("ready", () => {
    console.log("I am ready!");
});
    
client.on("message", (message) => {
    if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
    }
});
    
client.login(auth.token);
