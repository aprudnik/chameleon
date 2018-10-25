var AWS = require('aws-sdk');
var config = require('../config')
const getExamples = require("./getExamples")


initial = getExamples.getJson()

AWS.config.region = config.aws.region; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.aws.identityPool,
        });

var lexmodelbuildingservice = new AWS.LexModelBuildingService();


function getIntentChecksum(intentName, callback) {
    var params = {
        version: "$LATEST", 
        name: intentName
       };
    lexmodelbuildingservice.getIntent(params, function(err, data) {
        if (err) {
            console.log(err.message)
            callback(null)
        }
         else callback(data.checksum);})
}

function getSlotTypeChecksum(slotTypeName, callback) {
    var params = {
        version: "$LATEST", 
        name: slotTypeName
       };
    lexmodelbuildingservice.getSlotType(params, function(err, data) {
         if (err) {
            console.log(err.message)
            callback(null)
        }
         else callback(data.checksum);})
}

function addIntent(name, ModExamples, slots, response) {
    getIntentChecksum(name, function(checksum){
        var params = {
            "name": name, 
            "description": "", 
            "fulfillmentActivity": {
            "type": "ReturnIntent"
            }, 
            "sampleUtterances": ModExamples, 
            "slots": slots
        };
        if (checksum) {params["checksum"]=checksum}
        //response(null, params)
        lexmodelbuildingservice.putIntent(params, function(err, data){
            if (err) {
                console.log(err.message)
            } 
            if (checksum) {response("1",data); }
            else {response("$LATEST",data);}
        })
    })
}


async function runLoop(){
    intents = []

    initial["Intents"].forEach(intent => {
        slots = {}
        slots["slots"]=[]
        slots["entities"]=[]
        modText0 = []
        intent["Examples"].forEach(example => {
            entityList = getExamples.getTextEntities(example,  Object.keys(initial["Entities"]))
            entityList.forEach(entity => {
                if (slots["entities"].indexOf(entity) == -1){
                    sampleUtterances = []
                    intent["Examples"].forEach(example =>{
                        results = getExamples.getTextEntities(example, Object.keys(initial["Entities"]))
                        results.forEach(foundEntity =>{
                            if (entity!=foundEntity){
                                sampleUtterances.push(example.replace(`{`+foundEntity+`}`, initial["Entities"][foundEntity][0]))
                            }
                        })
                    })
                    
                    slot = {
                        "name": entity, 
                        "description": "", 
                        "priority": 1, 
                        "sampleUtterances": [], 
                        "slotConstraint": "Optional", 
                        "slotType": entity+`Type`, 
                        "slotTypeVersion": "$LATEST", 
                    }
                    console.log(slot["sampleUtterances"])
                    slots["slots"].push(slot)
                    slots["entities"].push(entity)
                }
            })
        })   
        intents.push([intent["Name"], intent["Examples"], slots["slots"]])
    })
    return intents    
}


async function putSlotType(callback) {
    createdTypes = []
    Object.keys(initial["Entities"]).forEach(entity => {
            getSlotTypeChecksum(entity+`Type`, function(checksum){
            values = []
            initial["Entities"][entity].forEach(value =>{
                values.push({"value": value})
            })
            var params = {
                "name": entity+`Type`, 
                "description": "", 
                "enumerationValues": values
            };
            if (checksum) {params["checksum"]=checksum}
            //console.log(params)
            lexmodelbuildingservice.putSlotType(params, function(err, data){
                createdTypes.push(entity+`Type`)
                if (err) {
                    console.log(err.message)
                }                
                if (Object.keys(initial["Entities"]).length == createdTypes.length) {
                        console.log("SlotTypes created")
                        putIntent(callback)
                }
            })
        })
    })
    
}

async function putIntent(){
    intents = await runLoop()
    done = {}
    intents.forEach(intent => {
        addIntent(intent[0], intent[1], intent[2], function(err, data){
            done[intent[0]]= err
            if (intents.length == Object.keys(done).length){
                console.log("Intents created")
                updateBot(done, createIntentVersions)
            }
            
        })
    })
}

async function updateBot(done, callback){
        getBotData(function(checksum){
        payload =[]
        initial["Intents"].forEach(intent => {
            payload.push({
                intentName: intent["Name"], 
                intentVersion: done[intent["Name"]]
                })
        })
        var params = {
            intents: payload,
            name: config.aws.botName,
            locale: "en-US",
            childDirected: false,
            checksum: checksum,
            clarificationPrompt: {
                maxAttempts: 1,
                messages: [{
                    content: "Can you repeate what you just said?", 
                    contentType: "PlainText",
                    groupNumber: 1
                }]
            },
            abortStatement: {
                messages: [ 
                  {
                    content: 'STRING_VALUE',
                    contentType: "PlainText",
                    groupNumber: 1
                  }
                ]
            }
        }
        lexmodelbuildingservice.putBot(params, function(err, data) {
            if (err) {console.log(err.message);}
            else { 
                callback(done, config.aws.botName, checksum);
                console.log("Bot Update completed")
            }
        })
    })
}

async function getBotData(response){
    var params = {
        versionOrAlias: "$LATEST" ,
        name: config.aws.botName
      };
      lexmodelbuildingservice.getBot(params, function(err, data) {
        if (err) {console.log(err.message); }// an error occurred
        else   {  response(data.checksum)  }        // successful response
      });
}

function publishBot(done, name, checksum){
    var params = {
        name: name,
        checksum: checksum
    };
    lexmodelbuildingservice.createBotVersion(params, function(err, data) {
        if (err) console.log(err.message); // an error occurred
        else     console.log(data);           // successful response
    });
}

function createIntentVersions(intentVersions){
    done = {}
    Object.keys(intentVersions).forEach(intent => {
        if (intentVersions[intent] == "$LATES"){
            getIntentChecksum(intent, function(checksum){
                lexmodelbuildingservice.createIntentVersion({name: intent, checksum: checksum}, function(err, data) {
                    if (err) console.log("Create Intent version error: ", err.message); // an error occurred
                    else {
                        done[intent] = "1"
                        console.log(intent, "version created")
                    }
                }) 
            })
        }
        else done[intent] = "1"
        if (Object.keys(intentVersions).length==Object.keys(done).length){
            console.log("Intent Versions created")
            updateBot(done, publishBot)
        }
    })
}


putSlotType(createIntentVersions)

