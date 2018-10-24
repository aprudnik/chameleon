var AWS = require('aws-sdk');
var config = require('../config')
const getExamples = require("./getExamples")


initial = getExamples.getJson()

AWS.config.region = config.aws.region; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.aws.identityPool,
        });

var lexmodelbuildingservice = new AWS.LexModelBuildingService();
var lexUserId = 'chatbot-demo' + Date.now();
var sessionAttributes = {};

function addIntent(name, ModExamples, slots, response) {
    var params = {
        "name": name, 
        "description": "", 
        "fulfillmentActivity": {
         "type": "ReturnIntent"
        }, 
        "sampleUtterances": ModExamples, 
        "slots": slots
       };
    response(null, params)
    // lexmodelbuildingservice.putIntent(params, function(err, data){
    //     if (err) {
    //         console.log(err)
    //     }
    //     response(null,data)
    // })

}


async function runLoop(){
    intents = []

    initial["Intents"].forEach(intent => {
        slots = []
        
        intent["Examples"].forEach(example => {
            modText = getExamples.makeList(initial["Entities"], example)
            modText0 = []
            modText.forEach(text =>{
                modText0.push(text[0])
            })
            entityList = getExamples.getTextEntities(example,  Object.keys(initial["Entities"]))
            entityList.forEach(entity => {
                slot = {
                    "name": entity, 
                    "description": "", 
                    "priority": 1, 
                    "sampleUtterances": intent["Examples"], 
                    "slotConstraint": "Optional", 
                    "slotType": entity+`Type`, 
                    "slotTypeVersion": "$LATEST", 
                }
                slots.push(slot)
            })
            intents.push([intent["Name"], modText0, slots])
        })    
    })
    return intents    
}

async function putIntent(){
    intents = await runLoop()
    intents.forEach(intent => {
        addIntent(intent[0], intent[1], intent[2], function(err, data){
            console.log(data)
        })
    })
}

putIntent()