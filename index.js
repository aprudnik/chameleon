const express = require('express');
const bodyParser = require('body-parser');
var config = require('./conf/config')


const app = express();

//port to start the process on, default: 8080
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

const verificationControllerFacebook = require('./controllers/facebookVerification');
const verificationControllerSlack = require('./controllers/slackVerification');
const verificationControllerSkype = require('./controllers/skypeMessage');
const messageWebhookController = require('./controllers/facebookMessage');
const discordBot = require('./controllers/discord')
const getIntents = require('./controllers/getIntents')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('Hello, I am Chameleon!'))
app.get('/text', (req, res) => 
    getIntents(config.active, req.query.message, function (err, body){
         res.send(body)}
    )) 
app.get('/verify', verificationControllerFacebook);
app.post('/verify', messageWebhookController);
app.post('/slack', verificationControllerSlack);
app.post('/skype', verificationControllerSkype);
app.get('/changeBot/:bot', (req,res) => {
    const params = req.params
    config.setActiveBot(params.bot);
    res.send('Changed Active Bot to ' + config.active)
})

discordBot

app.listen(port, () => console.log(`Webhook server is listening, port ${port}`));