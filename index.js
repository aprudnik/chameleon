const express = require('express');
const bodyParser = require('body-parser');
var config = require('./config')


const app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const verificationControllerFacebook = require('./controllers/verification');
const verificationControllerSlack = require('./controllers/slackVerification');
const messageWebhookController = require('./controllers/messageWebhook');
const discordBot = require('./controllers/discord')
const getIntents = require('./controllers/pathSelection')
const awsLex = require('./controllers/awsLex')
const dialog = require('./controllers/dialog')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello, I am Chahemeleon!'))
app.get('/text', (req, res) => 
    getIntents(config.active, req.query, function (err, body){
        dialog(body.intent,resMessage => {res.send(resMessage)})
    })) 
app.get('/verify', verificationControllerFacebook);
app.post('/slack', verificationControllerSlack);
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