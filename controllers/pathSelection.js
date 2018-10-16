const config = require('../config')

const getLuisIntent = require('../controllers/luis')
const getWatsonIntent = require('../controllers/watson')
const getAwsIntent = require('../controllers/awsLex')

var responseList = {}
var entities = {}
doneWork = []
entitiesList = []
intentList = []

const done = (err, body) =>{
    
    if (typeof body === "string") {
        body = JSON.parse(body)
    }
    //Watson json parse
    if (body.intents){
        doneWork.push("Watson")
        if (Object.keys(body.intents).length>0){
            response = {}
            response["intent"] = body.intents[0].intent;
            response["score"] = body.intents[0].confidence;
            intentList.push(response);
        } else {
            intentList.push({"intent": "None","score": 0});
            }
        if (body.entities){
            body.entities.forEach(entity => {
                entities = {}
                entities["type"] = entity.entity;
                entities["value"] = entity.value;
                entitiesList.push(entities);
            });
        }
    }

    //LUIS json parse
    if (body.topScoringIntent){
        response = {}
        response["intent"] = body.topScoringIntent.intent;
        response["score"] = body.topScoringIntent.score;
        intentList.push(response);
        body.entities.forEach(entity => {
            entities = {}
            entities["type"] = entity.type;
            entities["value"] = entity.entity;
            entitiesList.push(entities);
        });
    }

    //AWS json parse
    if (body.intentName){
        response = {}
        response["intent"] = body.intentName
        console.log(body.slots)
        if(body.slots){
            body.slots.forEach( entity => {
                entities = {}
                entities["type"] = entity.keys()[0];
                entities["value"] = entity[entities["type"]];
                entitiesList.push(entities);
            })
        }

    }

    //Combined entities
    if (intentList.length > 1){
        console.log(intentList)
        var res = Math.max.apply(Math,intentList.map(function(o){
            if (o.intent == "None"){o.score = 0}
            return o.score;}))
        var obj = intentList.find(function(o){ return o.score == res; })
        responseList["entities"] = entitiesList;
        responseList["intent"] = obj.intent;
        responseList["score"] = obj.score;
    }
    //Choosing the top intent

}


module.exports = (bot, text, response) => {
    message = text.message;
    console.log(message)
    if (bot.indexOf('aws') >= 0){ getAwsIntent(message,done) }
    if (bot.indexOf('luis') >= 0){ getLuisIntent(message,done) }
    if (bot.indexOf('watson') >= 0){ getWatsonIntent(message,done) }

    if (Object.keys(responseList).length == config.active.length ) {
        response(null, responseList);
        intentList = []
        entitiesList = []
    }
}