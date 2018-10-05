const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const verificationControllerFacebook = require('./controllers/verification');
const verificationControllerSlack = require('./controllers/slackVerification');
const messageWebhookController = require('./controllers/messageWebhook');
const discordBot = require('./controllers/discord')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/verify', verificationControllerFacebook);
app.post('/slack', verificationControllerSlack);
app.post('/verify', messageWebhookController);

discordBot

app.listen(port, () => console.log(`Webhook server is listening, port ${port}`));