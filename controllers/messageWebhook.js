const processFacebookMessage = require('../helpers/processFacebookMessage');
var discordMessage = require('./discord')
var watson = require('./watson')

module.exports = (req, res) => {
    // console.log(JSON.stringify(req.body))
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    // discordMessage(event.message.text)
                    // console.log(watson(event.message.text))
                    
                    processFacebookMessage(event.sender.id, watson(event.message.text))
                }
            });
        });
        res.status(200).end();
    }

};