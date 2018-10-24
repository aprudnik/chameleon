const processFacebookMessage = require('../helpers/processFacebookMessage');
const getIntents = require('./pathSelection')
const dialog = require('./dialog')
var config = require('../config')

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    getIntents(config.active, event.message.text, function (err, body){
                        console.log("Facebook log : ",body)
                        dialog(body,resMessage => {processFacebookMessage(event.sender.id,resMessage)})
                    })

                    // watson(event.message.text,function done(err,callback)
                    // {
                    //     processFacebookMessage(event.sender.id, callback.output.generic[0].text)
                    // })
                }
            });
        });
        res.status(200).end();
    }

};