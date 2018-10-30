const config = require('../conf/config')

const getLuisIntent = require('../nl-assistant/luis')
const getWatsonIntent = require('../nl-assistant/watson')
const getAwsIntent = require('../nl-assistant/awsLex')
var Promise = require('promise');

var responseList = {}
var entities = {}
doneWork = []
entitiesList = []
var intentList = []
var entities = {}

const done = (err, body, result) =>{
    
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
                entities[entity.entity] = entity.value;
                entitiesList.push(entities);
            });
        }
    }

    //LUIS json parse
    if (body.topScoringIntent){
        intentList.push(body.topScoringIntent.intent);
        body.entities.forEach(entity => {
            entities[entity.type] = entity.entity;
            entitiesList.push(entities);
        });
    }

    //AWS json parse
    if (body.intentName){
        intentList.push(body.intentName)
        if(body.slots){
            Object.keys(body.slots).forEach( entityName => {
                entities[entityName] = body.slots[entityName];
                entitiesList.push(entities);
            })
        }

    }

    //Combined entities
    console.log(intentList)
        var reducedList = intentList.reduce(function (map, word){
            map[word] = ( map[word] || 0) + 1;
            return map;
        }, Object.create(null))
        var maxValue = Math.max.apply(null, Object.values(reducedList))
        var maxIntent = Object.keys(reducedList).find(function(a) {
                return reducedList[a] === maxValue
            });
        responseList["entities"] = entities;
        responseList["intent"] = maxIntent;
        
        result(responseList)

}


module.exports = (bot, text, response) => {
 async function promiseWrap(notWrapedFunction, name) {
        return new Promise(resolve => {
            notWrapedFunction(text,(err,body) => {
                done(null,body,(result) => {
                    console.log(name)
                    resolve(result)
                })
            })
        })
    }

    // waitAll()
async function run() {
    if (config.active.indexOf("luis") > -1) await promiseWrap(getLuisIntent, "LUIS");
    if (config.active.indexOf("watson") > -1) await promiseWrap(getWatsonIntent, "Watson")
    if (config.active.indexOf("aws") > -1) await promiseWrap(getAwsIntent, "aws")
    intentList = []
    entities = {}
    response(null,responseList)
}
run ()
}