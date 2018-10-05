const slackMessage = require('../helpers/slackMessage');

module.exports = (req, res) => {
 const slackChallenge = req.body['challenge'];
 const verifyTypeMatches = (req.query['type'] === 'url_verification');
 const type = req.query['type']

if (slackChallenge && verifyTypeMatches) {
    res.status(200).send(slackChallenge);
 }
 else if (type) {
    slackMessage(req.body);
 }
  else {
    res.status(403).end();
  }
};