var config = require('../conf/config')
const getIntents = require('./pathSelection')
const dialog = require('./dialog')

const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');
const skypeBot = require(`./skypeBot`)
const adapter = new BotFrameworkAdapter({
    appId: "786c5027-169e-4958-895a-a692f47f28b0",
    appPassword: "xtgatSSSRUR8593?;inG1}*"
 });
 


const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

async function getReply(text, callback) {
    await getIntents(config.active, text, async function (err, body){
        await dialog(body,async function(resMessage) {
            await callback(resMessage)
        })
    })
}


let bot;
try {
    bot = new skypeBot(conversationState, userState);
} catch (err) {
    console.error(`[botInitializationError]: ${err}`);
    process.exit();
}


module.exports = async function (req, res) {
    await getReply(req.body.text, async function (reply) {
        // Route received a request to adapter for processing
         adapter.processActivity(req, res, async (turnContext) => {
            // route to bot activity handler.
            await bot.onTurn(turnContext, reply);
        })
    })
}