//Sends a facebook message
const getIntents = require('./pathSelection')
const dialog = require('./dialog')
var config = require('../conf/config')
const request = require('request');

const FACEBOOK_ACCESS_TOKEN = config.facebook.accessToken

const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

async function getReply(text, userID, callback) {
    await getIntents(config.active, text, async function (err, body){
        await dialog(body, userID, text, async function(resMessage) {
            callback(resMessage)
        })
    })
}


module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    getReply(event.message.text, event.sender.id,  async function (reply) {
                        sendTextMessage(event.sender.id, reply)
                    })
                }
            });
        });
        res.status(200).end();
    }

};