var config = {}

// active examples :  aws, watson
// config.active = ['watson','luis', 'aws']
config.active = ['watson','luis']
//  config.active = ['watson']

function setActiveBot(bot) {
    console.log('Changing Active Bot to ' + bot)
    config.active = bot
}

config.watson = {}
config.aws = {}
config.discord = {}
config.luis = {}
config.mbf = {}
config.facebook = {}
config.slack = {}

config.facebook.verifyToken = 'chameleon'
config.facebook.accessToken ='EAAeoT1yyLaUBAKZCZBcdGZCSsW38Oi3GkOoilMNwHLXdfhb3sncUgodgiHqZA4XTNUwruoScjssaLDq2DRt2ZCriHe7xUhlZBzmyKZCpMfxffZBh3EupSHWo4nSNoZAaLG4VAyiTjAx4S4B70UuP5fgBCiVRJyUn55uQiz32mAzBFPUe5TIZAzZCVW8';

config.slack.accessToken = "xoxb-448604844673-449223431682-XIZX0GLl04UQT7kFi08erdft"
config.slack.botUserID = "UD76KCPL2"

config.watson.workspace_id = 'ff9fa0f0-beb9-4008-b009-f1cc6af5fe51'
config.watson.username = '095c9c0f-24fb-4269-bb43-7038377b6a98'
config.watson.password = 'ooYfoLy4eMAJ'
config.watson.version = '2018-07-10'


config.discord.token = "NDk3Mzc4NTExNjE5NjIwODg1.Drr1qw.YPwxDPwDeX8YA_UEHjLah45mEI4"
config.discord.textStart = "!"

config.luis.url = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4fb9c915-be86-4951-b5ab-a2593798d264?subscription-key=e17b1f8d66d3410abadc94ac2ceb1ce9&timezoneOffset=-360&q=`
config.luis.apiURL = `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/4fb9c915-be86-4951-b5ab-a2593798d264/versions/0.1/`
config.luis.subscriptionKey = `?subscription-key=e17b1f8d66d3410abadc94ac2ceb1ce9`
config.luis.publishURL = `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/4fb9c915-be86-4951-b5ab-a2593798d264/publish`


config.aws.region = 'eu-west-1'
config.aws.identityPool = 'eu-west-1:12c5e820-9708-478b-90c6-111ffbffee99'
config.aws.botName = 'Team_bot'
config.aws.botAlias = 'Team_B'

config.mbf.appId = "786c5027-169e-4958-895a-a692f47f28b0"
config.mbf.appPassword = "xtgatSSSRUR8593?;inG1}*"

module.exports = config;
module.exports.setActiveBot = (bot) => setActiveBot(bot);