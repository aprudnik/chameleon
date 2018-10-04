const processFacebookMessage = require('../helpers/processFacebookMessage');

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    processFacebookMessage(event);
                }
            });
        });
        res.status(200).end();
    }

};