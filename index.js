const express = require('express');
const bodyParser = require('body-parser');
var config = require('./config')
const send = require('./dialog')

const app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const verificationControllerFacebook = require('./controllers/verification');
const verificationControllerSlack = require('./controllers/slackVerification');
const messageWebhookController = require('./controllers/messageWebhook');
const discordBot = require('./controllers/discord')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello Chahemeleon'))
app.get('/text', (req, res) => res.send(send(req.query, function (body){console.log(body)})) )
app.get('/verify', verificationControllerFacebook);
app.post('/slack', verificationControllerSlack);
app.post('/verify', messageWebhookController);
app.get('/changeBot/:bot', (req,res) => {
    const params = req.params
    config.setActiveBot(params.bot);
    res.send('Changed Active Bot to ' + config.active)
})

discordBot

app.listen(port, () => console.log(`Webhook server is listening, port ${port}`));