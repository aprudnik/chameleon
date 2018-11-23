//Responds to Discord messages
const Discord = require("discord.js");
var config = require('../conf/config')
const getIntents = require('./getIntents')
const dialog = require('./dialog')

const client = new Discord.Client();


client.login(config.discord.token);
    
client.on("ready", () => {
    console.log("I am ready!");
});

async function getReply(text, userID, callback) {
    await getIntents(config.active, text, async function (err, body){
        await dialog(body, userID, text, async function(resMessage) {
            callback(resMessage)
        })
    })
}

    
client.on("message", (message) => {
    //check if the message was for us
    if (message.content.startsWith(config.discord.textStart)) {
        message.content = message.content.substr(config.discord.textStart.length)
        getReply(message.content, message["author"].id,  async function (reply) {
            message.channel.send(reply)
        })
    } 
});
    