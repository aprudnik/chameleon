const slackMessage = require('../helpers/slackMessage');

module.exports = (req, res) => {
 const slackChallenge = req.body['challenge'];
 const verifyTypeMatches = (req.body['type'] === 'url_verification');
 const type = req.body['type'];

 
if (slackChallenge && verifyTypeMatches) {
    res.status(200).send(slackChallenge);
 }
 else if (type) {
    slackMessage(req.body);
    res.sendStatus(200);
 }
  else {
    res.status(403).end();
  }
};