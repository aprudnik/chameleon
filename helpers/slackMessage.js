var discordMessage = require('../controllers/discord')
const request = require('request');

const sendTextMessage = (channel, user, text) => {
    token = "xoxb-448604844673-449223431682-XIZX0GLl04UQT7kFi08erdft"
    url_to_send = `https://slack.com/api/chat.postMessage?token=${token}&channel=${channel}&text=${text}&as_user=chambot&pretty=1`
    request({
        url: url_to_send,
        method: 'GET'
    });
    console.log(url_to_send)
};


module.exports = (message) => {

    const text = message.event.text;
    const channel = message.event.channel;
    const user = message.event.user;
    
    sendTextMessage(channel, user, text);
 };
 
