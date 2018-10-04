module.exports = (req, res) => {
 const hubChallenge = req.query['hub.challenge'];

 const hubMode = req.query['hub.mode'];
 const verifyTokenMatches = (req.query['hub.verify_token'] === 'chameleon');
 const slackChallenge = req.query['challenge'];

 if (hubMode && verifyTokenMatches) {
    res.status(200).send(hubChallenge);
 }
 else if (slackChallenge) {
    res.status(200).send(slackChallenge);
 }
  else {
    res.status(403).end();
  }
};