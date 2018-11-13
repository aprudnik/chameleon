const processFacebookMessage = require('../helpers/processFacebookMessage');
const getIntents = require('./pathSelection')
const dialog = require('./dialog')
var config = require('../conf/config')

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    getIntents(config.active, event.message.text, function (err, body){
                        dialog(body, event.sender.id, event.message.text, resMessage => {
                            processFacebookMessage(event.sender.id,resMessage)
                        })
                    })
                }
            });
        });
        res.status(200).end();
    }

};