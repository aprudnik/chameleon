var discordMessage = require('../controllers/discord')

module.exports = (event) => {
    console.log("something");
    discordMessage(JSON.stringify(event));
 };