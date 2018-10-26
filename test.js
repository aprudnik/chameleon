const fs = require('fs');

let rawdata = fs.readFileSync("./knowledgeDB/test.json");  
let dialogSet = JSON.parse(rawdata); 


entities= []
currentIntent = null

async function dialog(response, returnResponse) {
    if (currentIntent != null) intent = currentIntent;
    else intent = response.intent;
    console.log(intent)
    Object.keys(response.entities).forEach(entity => {entities.push(entity)})
    askFor = []
    found = []
    if (Object.keys(dialogSet).indexOf(intent) > -1) {
        dialogSet[intent]["requiredEntities"].forEach(reqEntity => {
            if (entities.indexOf(reqEntity) == -1) {askFor.push(reqEntity)}
            else {found.push(reqEntity)}
        });
        askFor.forEach(missingEntity =>{
            setCurrentIntent(intent)
            returnResponse(dialogSet[intent]["reqEntityRequest"][missingEntity])
        })
        if (found.length == dialogSet[intent]["requiredEntities"].length){
            // if (dialogSet[intent]["completionConfirmation"] != ""){
            //     returnResponse(dialogSet[intent]["completionConfirmation"], intent)
            // }
            // else {
            returnResponse( await startFunction(dialogSet[intent], intent, entities, response))
            setCurrentIntent(null)
            entities = []
            // }
            
        }
    }
    else {
        setCurrentIntent(null)
        returnResponse("Sorry, I didn't understand you can you rephrase")
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