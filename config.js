var config = {}

// active examples :  aws, watson
config.active = 'watson'

function setActiveBot(bot) {
    console.log('Changing Active Bot to ' + bot)
    config.active = bot
}

config.watson = {}
config.aws = {}
config.discord = {}
config.luis = {}

config.watson.workspace_id = 'ff9fa0f0-beb9-4008-b009-f1cc6af5fe51'
config.watson.username = '095c9c0f-24fb-4269-bb43-7038377b6a98'
config.watson.password = 'ooYfoLy4eMAJ'
config.watson.version = '2018-07-10'

config.discord.channelId = '497380218701611011'

config.luis.url = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4fb9c915-be86-4951-b5ab-a2593798d264?subscription-key=e17b1f8d66d3410abadc94ac2ceb1ce9&timezoneOffset=-360&q=`


module.exports = config;
module.exports.setActiveBot = (bot) => setActiveBot(bot);