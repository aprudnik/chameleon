//const processMessage = require('../helpers/processMessage');

module.exports = (req, res) => {
    console.log(JSON.stringify(req.body))
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    //processMessage(event);
                    console.log(event)
                }
            });
        });
        res.status(200).end();
    }
    else {
        console.log(`TYPE ${req.body.object}`)
        res.status(200).end();
    }
};