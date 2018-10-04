#const http = require('http')
#const port = 8080
#const requestHandler = (request, response) => {
#    console.log(request.url)
#    response.end('Hello Node.js Server!')
#}
#const server = http.createServer(requestHandler)
#server.listen(port, (err) => {
#    if (err) {
#        return console.log('something bad happened', err)
#    }
#    console.log(`server is listening on ${port}`)
#})
#

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.get('/', (req, res) => res.send('Hello World!'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Webhook server is listening, port ${port}`));