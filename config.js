var config = {}

// active examples :  aws, watson
// config.active = 'aws'

function setActiveBot(bot) {
    console.log('Changing Active Bot to ' + bot)
    config.active = bot
}
console.log('just for fun')

config.watson = {}
config.aws = {}
config.discord = {}

config.watson.workspace_id = 'ff9fa0f0-beb9-4008-b009-f1cc6af5fe51'
config.watson.username = '095c9c0f-24fb-4269-bb43-7038377b6a98'
config.watson.password = 'ooYfoLy4eMAJ'
config.watson.version = '2018-07-10'

config.discord.channelId = '497380218701611011'



module.exports = config;
module.exports.setActiveBot = (bot) => setActiveBot(bot);