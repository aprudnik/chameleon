const express = require('express');
const bodyParser = require('body-parser');
var config = require('./config')

const app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const verificationControllerFacebook = require('./controllers/verification');
const verificationControllerSlack = require('./controllers/slackVerification');
const messageWebhookController = require('./controllers/messageWebhook');
const discordBot = require('./controllers/discord')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/verify', verificationControllerFacebook);
app.post('/slack', verificationControllerSlack);
app.post('/verify', messageWebhookController);
app.post('/changeBot', (req,res) => {
    config.setActiveBot(req.body.bot);
    res.send('Changing Active Bot to ' + config.active)
})

// config.setActiveBot('watson');

discordBot

app.listen(port, () => console.log(`Webhook server is listening, port ${port}`));