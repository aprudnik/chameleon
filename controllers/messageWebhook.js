const processFacebookMessage = require('../helpers/processFacebookMessage');
var discordMessage = require('./discord')
var watson = require('./watson')

module.exports = (req, res) => {
    // console.log(JSON.stringify(req.body))
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    watson(event.message.text,function done(err,callback)
                    {
                        processFacebookMessage(event.sender.id, callback.output.generic[0].text)
                    })
                }
            });
        });
        res.status(200).end();
    }

};