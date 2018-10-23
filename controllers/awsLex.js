var AWS = require('aws-sdk');
var config = require('../config')

AWS.config.region = config.aws.region; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.aws.identityPool,
        });

var lexruntime = new AWS.LexRuntime();
var lexUserId = 'chatbot-demo' + Date.now();
var sessionAttributes = {};

function pushChat(text, response) {

    var params = {
        botAlias: config.aws.botAlias,
        botName: config.aws.botName,
        inputText: text,
        userId: lexUserId,
        sessionAttributes: sessionAttributes
    };
    console.log(params)
    lexruntime.postText(params,function(err,data){
        if (err) {
            console.log(err)
        }
        response(null,data)
    })

}

module.exports = (text, response) => {
    pushChat(text, response)
}
