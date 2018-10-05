var discordMessage = require('../controllers/discord')
const request = require('request');
var watson = require('../controllers/watson')

const sendTextMessage = (channel, user, text) => {
    token = "xoxb-448604844673-449223431682-XIZX0GLl04UQT7kFi08erdft"
    url_to_send = `https://slack.com/api/chat.postMessage?token=${token}&channel=${channel}&text=${text}&as_user=chambot&pretty=1`
    if (user != "UD76KCPL2") {
        request({
            url: url_to_send,
            method: 'GET'
            })   
    ;}
};


module.exports = (message) => {

    const text = message.event.text;
    const channel = message.event.channel;
    const user = message.event.user;
    watson(text,function done(err,callback)
                    {
                        sendTextMessage(channel, user, callback);
                    })
    
 };
 
