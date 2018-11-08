const fs = require('fs');

let rawdata = fs.readFileSync("./conf/dialog.json");  
let dialogSet = JSON.parse(rawdata); 

var Handler = require("./handler")


entities= {}
intent = {}
currentIntent = {}
askFor = {}
foundEntities = {}

async function dialog(response, userID, returnResponse) {
    if (currentIntent[userID] != null) intent[userID] = currentIntent[userID];
    else intent[userID] = response.intent;
    if (entities[userID] == null){
        entities[userID] = Object.assign(response.entities)
    } else {
        entities[userID] = Object.assign(entities[userID],response.entities)
    }
    askFor[userID] = []
    foundEntities[userID] = []
    if (Object.keys(dialogSet).indexOf(intent[userID]) > -1) {
        dialogSet[intent[userID]]["requiredEntities"].forEach(reqEntity => {
            if (Object.keys(entities[userID]).indexOf(reqEntity) == -1) {askFor[userID].push(reqEntity)}
            else {foundEntities[userID].push(reqEntity)}
        });
        askFor[userID].forEach(missingEntity =>{
            setCurrentIntent(intent[userID], userID)
            returnResponse(dialogSet[intent[userID]]["reqEntityRequest"][missingEntity])
        })
        if (foundEntities[userID].length == dialogSet[intent[userID]]["requiredEntities"].length){
            await returnResponse (await Handler[dialogSet[intent[userID]].completionAction](dialogSet[intent[userID]], intent[userID], entities[userID], response))
            setCurrentIntent(null, userID)
            entities[userID] = []
        }
    }
    else {
        setCurrentIntent(null, userID)
        returnResponse("Sorry, I didn't understand can you rephrase")
    }
}



function setCurrentIntent(intent, userID){
    currentIntent[userID] = intent
}

module.exports = async (body, userID, res) => {
    dialog(body, userID, res)
}