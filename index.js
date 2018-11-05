const express = require('express');
const bodyParser = require('body-parser');
var config = require('./conf/config')


const app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const verificationControllerFacebook = require('./controllers/verification');
const verificationControllerSlack = require('./controllers/slackVerification');
const verificationControllerSkype = require('./controllers/skypeVerification');
const messageWebhookController = require('./controllers/messageWebhook');
const discordBot = require('./controllers/discord')
const getIntents = require('./controllers/pathSelection')
const awsLex = require('./nl-assistant/awsLex')
const dialog = require('./controllers/dialog')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
gText = ""
function getText(text){
    gText = text
    return text
}

app.get('/', (req, res) => res.send('Hello, I am Chameleon!'))
app.get('/text', (req, res) => 
    getIntents(config.active, req.query.message, function (err, body){
         res.send(body)}
    )) 
app.get('/verify', verificationControllerFacebook);
app.post('/slack', verificationControllerSlack);
app.post('/skype',  (req, res) => {res.send("200"); getText(req.body);return req});//verificationControllerSkype);
app.get('/skype', (req, res) => res.send(gText))
app.post('/verify', messageWebhookController);
app.get('/changeBot/:bot', (req,res) => {
    const params = req.params
    config.setActiveBot(params.bot);
    res.send('Changed Active Bot to ' + config.active)
})
app.post('/aws', (req,res) => {
    awsLex(req.body.message,function(err,response){
        res.send(response)
    })
})

discordBot

app.listen(port, () => console.log(`Webhook server is listening, port ${port}`));