const FACEBOOK_ACCESS_TOKEN = 'EAAeoT1yyLaUBAKZCZBcdGZCSsW38Oi3GkOoilMNwHLXdfhb3sncUgodgiHqZA4XTNUwruoScjssaLDq2DRt2ZCriHe7xUhlZBzmyKZCpMfxffZBh3EupSHWo4nSNoZAaLG4VAyiTjAx4S4B70UuP5fgBCiVRJyUn55uQiz32mAzBFPUe5TIZAzZCVW8';
const request = require('request');
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

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;


    sendTextMessage(senderId, message);
 };