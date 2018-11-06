const fs = require('fs');

let rawdata = fs.readFileSync("./conf/dialog.json");  
let dialogSet = JSON.parse(rawdata); 

var Handler = require("./handler")


entities= {}

currentIntent = null

async function dialog(response, returnResponse) {
    if (currentIntent != null) intent = currentIntent;
    else intent = response.intent;
    console.log(intent)
    entities = Object.assign(entities,response.entities)
    // Object.keys(response.entities).forEach(entity => {entities.push(entity)})
    askFor = []
    foundEntities = []
    if (Object.keys(dialogSet).indexOf(intent) > -1) {
        dialogSet[intent]["requiredEntities"].forEach(reqEntity => {
            if (Object.keys(entities).indexOf(reqEntity) == -1) {askFor.push(reqEntity)}
            else {foundEntities.push(reqEntity)}
        });
        askFor.forEach(missingEntity =>{
            setCurrentIntent(intent)
            returnResponse(dialogSet[intent]["reqEntityRequest"][missingEntity])
        })
        if (foundEntities.length == dialogSet[intent]["requiredEntities"].length){
            await returnResponse (await Handler[dialogSet[intent].completionAction](dialogSet[intent], intent, entities, response))
            // returnResponse( await startFunction(dialogSet[intent], intent, entities, response))
            setCurrentIntent(null)
            entities = []
        }
    }
    else {
        setCurrentIntent(null)
        returnResponse("Sorry, I didn't understand can you rephrase")
    }
}



async function startFunction(dialogSet, intent, entities, response) {
    namedEntities = []
    funcName = dialogSet["completionAction"]
    if (funcName == "response"){
        return dialogSet["response"]
    }
    else {
        entities.forEach(entity =>{
            namedEntities.push(`\n${entity}: ${response.entities[entity]}`)
        })
        console.log(`Start function ${funcName} for intent ${intent} with entities ${namedEntities}`)
        return `Start function ${funcName} for intent ${intent} with entities ${namedEntities}`
    }
}

function setCurrentIntent(intent){
    currentIntent = intent
}

module.exports = async (body,res) => {
    dialog(body,res)
}