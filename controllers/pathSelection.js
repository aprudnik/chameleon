const config = require('../conf/config')

const getLuisIntent = require('../nl-assistant/luis')
const getWatsonIntent = require('../nl-assistant/watson')
const getAwsIntent = require('../nl-assistant/awsLex')


var responseList = {}
var entities = {}
entitiesList = []
var intentList = []
var entities = {}

//list of builtin entities, to combine entities between different NLU back-ends all names are converted to Watson defaults
nlpAllignment = {"builtin.number" :"sys-number",
                "builtin.personName" :"sys-person" }
const allignmentCheck = (entity) => {if (nlpAllignment[entity] == null) return entity; 
                                    else return nlpAllignment[entity]}

//counts the number of times searchTerm was found in list
const count = (list, searchTerm) => list.filter((x) => x === searchTerm).length

//Combines intents and entities from back-end responses
const done = (err, body, result) =>{
    //LUIS returns a JSON string as a response, converting it to JSON Object
    if (typeof body === "string") {
        body = JSON.parse(body)
    }
    //Watson json parse
    if (body.intents){
        inputString = body.input.text
        //Get Intent if no Intent found set as "None"
        if (Object.keys(body.intents).length>0){
            intentList.push(body.intents[0].intent);
        } else {
            intentList.push("None");
        }
        //Get entities, -n for repeated entities, where n is count for that entity
        //this is used to pair up entities for filtering
        if (body.entities){
            duplicates = []
            body.entities.forEach(entity => {
                if (duplicates.indexOf(entity.entity)>-1){
                    addedKey = count(duplicates, entity.entity)
                    entities[entity.entity+`-${addedKey}`] = entity.value;
                } else {
                    entities[entity.entity] = entity.value;
                }
                duplicates.push(entity.entity)
                entitiesList.push(entities);
            });
        }
    }

    //LUIS json parse
    if (body.topScoringIntent){
        inputString = body.query
        //Get Intent, if Intent score is lower than 80% return "None"
        if (body.topScoringIntent.score > 0.8){
            intentList.push(body.topScoringIntent.intent);
        } else {
            intentList.push("None")
        }
        duplicates = []        
        body.entities.forEach(entity => {
            if (count(duplicates, entity.type)>0) addedKey= `-${count(duplicates, entity.type)}`;
                else addedKey= "";
            //Parsing LUIS entities, structure of JSON is different between builtin, Synonym list and simple entities
            if (entity.resolution){
                if (entity.resolution.values) {
                    entities[entity.type+addedKey] = entity.resolution.values[0];
                } else {
                    entities[allignmentCheck(entity.type)+addedKey] = entity.resolution.value
                }
            } else {
                entities[allignmentCheck(entity.type)+addedKey] = entity.entity
            }
            duplicates.push(entity.type)
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
    //Counts Intents, "None" is given a value of -1, so it's only selected if nothnig else is found
    var reducedList = intentList.reduce(function (map, word){
        if (word=="None") map[word]=-1;
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

// Sends received text to NLU engines and waits for the combined result
async function run() {
    if (config.active.indexOf("luis") > -1) await promiseWrap(getLuisIntent, "LUIS");
    if (config.active.indexOf("watson") > -1) await promiseWrap(getWatsonIntent, "Watson")
    if (config.active.indexOf("aws") > -1) await promiseWrap(getAwsIntent, "aws")
    intentList = []
    entities = {}
    response(null, responseList)
}
run ()
}