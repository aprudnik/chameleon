var config = require('../conf/config')
const getIntents = require('./getIntents')
const dialog = require('./dialog')

const skypeBot = require(`./skypeBot`)
const { BotFrameworkAdapter, MemoryStorage, ConversationState} = require('botbuilder');


const adapter = new BotFrameworkAdapter({
    appId: config.mbf.appId,
    appPassword: config.mbf.appPassword
 });
 

const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);

async function getReply(text, userID, callback) {
    await getIntents(config.active, text, async function (err, body){
        await dialog(body, userID, text, async function(resMessage) {
            callback(resMessage)
        })
    })
}


let bot;
try {
    bot = new skypeBot(conversationState);
} catch (err) {
    console.error(`[botInitializationError]: ${err}`);
    process.exit();
}


module.exports = async function (req, res) {
    getReply(req.body.text, req.body.from.id,  async function (reply) {
        // Route received a request to adapter for processing
        adapter.processActivity(req, res, async (turnContext) => {
            // route to bot activity handler.
            await bot.onTurn(turnContext, reply);
        })
    })
}