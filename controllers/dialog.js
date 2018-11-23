const fs = require('fs');

var rawdata = fs.readFileSync("./conf/dialog.json");  
var dialogSet = JSON.parse(rawdata); 

var Handler = require("./handler")

fs.watchFile("./conf/dialog.json",function (curr, prev){
    if (curr.mtime != prev.mtime){
        console.log("change")
        rawdata = fs.readFileSync("./conf/dialog.json");  
        dialogSet = JSON.parse(rawdata);    
    }
})

entities= {}
intent = {}
currentIntent = {}
askFor = {}
foundEntities = {}
savedEntities = {}
searchEntities = {}

async function staticEntities(text, intent, userID){
    if (searchEntities[userID] == null){searchEntities[userID]={}}
    if (dialogSet[intent]){
        if (dialogSet[intent]["entitiesToFind"]){
            text = text.replace("|n", "\n")
            entitiesToFind = dialogSet[intent]["entitiesToFind"]
            for (var entity of Object.keys(entitiesToFind)){
                text.split("\n").forEach(line =>{
                    line = line.trim()
                    if (line.startsWith(entitiesToFind[entity])){
                        searchEntities[userID][entity] = line.replace(entitiesToFind[entity], "").trim()
                        console.log(line, entitiesToFind[entity])
                    }
                })
            }
        }
    }
    return searchEntities[userID]
}



async function dialog(response, userID, text, returnResponse) {
    // Check if we are inside a dialog, and set the Intent accordingly
    if (currentIntent[userID] != null) intent[userID] = currentIntent[userID];
    else intent[userID] = response.intent;
    // assign newly found entities to user
    if (entities[userID] == null){
        entities[userID] = Object.assign(response.entities)
    } else {
        entities[userID] = Object.assign(entities[userID],response.entities)
    }

    if (savedEntities[userID] == null){savedEntities[userID]={}}
    askFor[userID] = []
    foundEntities[userID] = []

    
    //check if an interruption is required
    if (response.intent == "cancel"){
        setCurrentIntent(null, userID)
        returnResponse(await Handler[dialogSet["cancel"].completionAction](dialogSet["cancel"], "cancel", entities[userID], response))
    }
    else{
        //is intent specified in dialog.json
        if (Object.keys(dialogSet).indexOf(intent[userID]) > -1) {
            //search for predefined entities
            staticEntities[userID] = await staticEntities(text, intent[userID], userID)
            //check if required entity is already found
            dialogSet[intent[userID]]["requiredEntities"].forEach(reqEntity => {
                if (Object.keys(entities[userID]).indexOf(reqEntity) == -1 &&
                    Object.keys(savedEntities[userID]).indexOf(reqEntity) == -1 &&
                    Object.keys(staticEntities[userID]).indexOf(reqEntity) == -1) {
                        askFor[userID].push(reqEntity)
                }
                else {foundEntities[userID].push(reqEntity)}
            });
            //if entity is not found, ask the user to provide it
            askFor[userID].forEach(missingEntity =>{
                setCurrentIntent(intent[userID], userID)
                returnResponse(dialogSet[intent[userID]]["reqEntityRequest"][missingEntity])
            })
            if (askFor[userID].length==0){
                //check if there are entities that we need to save for future use    
                if (dialogSet[intent[userID]]["entitiesToSave"]){
                    dialogSet[intent[userID]]["entitiesToSave"].forEach(sEntity =>{
                        console.log("sEntity", sEntity)
                        savedEntities[userID][sEntity] = entities[userID][sEntity] || savedEntities[userID][sEntity]
                    })
                }
                //adding needed saved and static entities to our entity list
                foundEntities[userID].forEach(entity =>{
                    if (Object.keys(entities[userID]).indexOf(entity) == -1 ||
                        Object.keys(staticEntities[userID]).indexOf(entity) > -1){
                        entities[userID][entity] = savedEntities[userID][entity] || staticEntities[userID][entity]
                    }
                })
                console.log("ent:",entities[userID], "savedEnt",savedEntities[userID])
                if (dialogSet[intent[userID]]["confirmation"]=="true"){
                    if (entities[userID]["boolean"]=="true"){
                        //proceed with complete action after getting positive answer on confirmation
                        await returnResponse (await Handler[dialogSet[intent[userID]].completionAction](dialogSet[intent[userID]], intent[userID], entities[userID], response))
                        setCurrentIntent(null, userID)
                        entities[userID] = []
                    } 
                    else if (entities[userID]["boolean"]=="false") {
                        //allow user to change values if something is incorrect
                        setCurrentIntent(intent[userID], userID)
                        entities[userID]["boolean"]=""
                        await returnResponse (dialogSet[intent[userID]]["failResponse"])
                    }
                    else {
                        //ask for confirmation, will repeat until receiving a "boolean" or "cancel" intent
                        setCurrentIntent(intent[userID], userID)
                        await returnResponse (await Handler["confirmation"](dialogSet[intent[userID]], intent[userID], entities[userID], response))
                    }
                } else {
                    //if no confirmation is required proceed to complete action
                    await returnResponse (await Handler[dialogSet[intent[userID]].completionAction](dialogSet[intent[userID]], intent[userID], entities[userID], response))
                    setCurrentIntent(null, userID)
                    entities[userID] = []
                }
            }
        }
        else {
            setCurrentIntent(null, userID)
            returnResponse("Sorry, I didn't understand can you rephrase")
        }
    }
}



function setCurrentIntent(intent, userID){
    currentIntent[userID] = intent
}

module.exports = async (body, userID, text, res) => {
    dialog(body, userID, text, res)
}