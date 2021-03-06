//Send response to Slack
const request = require('request');
var config = require('../conf/config')
const getIntents = require('./getIntents')
const dialog = require('./dialog')

const sendTextMessage = (channel, user, text) => {
    token = config.slack.accessToken
    url_to_send = `https://slack.com/api/chat.postMessage?token=${token}&channel=${channel}&text=${text}&as_user=chambot&pretty=1`
    if (user != config.slack.botUserID) {
        request({
            url: url_to_send,
            method: 'GET'
            })   
    }
}

async function getReply(text, userID, callback) {
    await getIntents(config.active, text, async function (err, body){
        await dialog(body, userID, text, async function(resMessage) {
            callback(resMessage)
        })
    })
}

module.exports = (message) => {

    const text = message.event.text;
    const channel = message.event.channel;
    const user = message.event.user;
    getReply(text, user,  async function (reply) {
        sendTextMessage(channel, user, reply);
    })
 };
 
