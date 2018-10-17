const config = require('../config')

const getLuisIntent = require('../controllers/luis')
const getWatsonIntent = require('../controllers/watson')
const getAwsIntent = require('../controllers/awsLex')

var responseList = {}
var entities = {}
doneWork = []
entitiesList = []
intentList = []

var responseCount = false

const done = (err, body) =>{
    
    if (typeof body === "string") {
        body = JSON.parse(body)
    }
    //Watson json parse
    if (body.intents){
        doneWork.push("Watson")
        if (Object.keys(body.intents).length>0){
            intentList.push(body.intents[0].intent);
        } else {
            intentList.push("None");
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
        intentList.push(body.topScoringIntent.intent);
        body.entities.forEach(entity => {
            entities = {}
            entities["type"] = entity.type;
            entities["value"] = entity.entity;
            entitiesList.push(entities);
        });
    }

    //AWS json parse
    if (body.intentName){
        intentList.push(body.intentName)
        if(body.slots){
            Object.keys(body.slots).forEach( entityName => {
                entities = {}
                entities["type"] = entityName;
                entities["value"] = body.slots[entityName];
                entitiesList.push(entities);
            })
        }

    }

    //Combined entities
    if (intentList.length == config.active.length){
        var reducedList = intentList.reduce(function (map, word){
            map[word] = ( map[word] || 0) + 1;
            return map;
        }, Object.create(null))
        var maxValue = Math.max.apply(null, Object.values(reducedList))
        var maxIntent = Object.keys(reducedList).find(function(a) {
                return reducedList[a] === maxValue
            });
        console.log(intentList)
        console.log(reducedList)
        // var res = Math.max.apply(Math,intentList.map(function(o){
        //     if (o.intent == "None"){o.score = 0}
        //     return o.score;}))
        // var obj = intentList.find(function(o){ return o.score == res; })
        responseList["entities"] = entitiesList;
        responseList["intent"] = maxIntent;
        responseCount = true
    }
    //Choosing the top intent

}


module.exports = (bot, text, response) => {
    message = text.message;
    if (bot.indexOf('aws') >= 0){ getAwsIntent(message,done) }
    if (bot.indexOf('luis') >= 0){ getLuisIntent(message,done) }
    if (bot.indexOf('watson') >= 0){ getWatsonIntent(message,done) }

    if (responseCount) {
        response(null, responseList);
        intentList = []
        entitiesList = []
        responseCount = false
    }
}