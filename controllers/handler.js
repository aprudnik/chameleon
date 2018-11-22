const csv=require('csvtojson')
const request = require('request');
const lampCsvFilePath='./knowledgeDB/lamp.csv'
const kettleCsvFilePath='./knowledgeDB/kettle.csv'
const hddCsvFilePath='./knowledgeDB/hdd.csv'
const dbDir = './knowledgeDB/'
const fs = require('fs');


// async function loadData () {
    
//     //var lampArray = await csv().fromFile(dbDir)
//     // var kettleArray = await csv().fromFile(kettleCsvFilePath)
//     // var hddArray = await csv().fromFile(hddCsvFilePath)
//     //return lampArray

//     await getCsvPath(async function (json){
//         //console.log(json)
//     })
// }

async function loadData(){
    curr = []
    for (fileName of fs.readdirSync(dbDir)) {
        curr.push(await csv().fromFile(dbDir+fileName))

        if (fs.readdirSync(dbDir).length == Object.keys(curr).length){
            var merged = [].concat(...curr)
            return merged
        }
    }
    //return curr
}


OrderTemplate = {}

Handler = {}

Handler.entities = []

const capitalized = ["sys-person"]

async function getCompare(mainList,varList){
    for (const el of mainList){
        var index = varList.indexOf(el)
        if (index > -1) { return el}
    }
    return 'None'
}

async function randomResponse(dialogSet){
    if (Array.isArray(dialogSet.response)){
        return dialogSet.response[dialogSet.response.length * Math.random() | 0]
    }
    else return dialogSet.response
}

async function jsonToTemplate (jsonObject) {
    var returnString = ""
    Object.keys(jsonObject).forEach(element => {
        if (element == "ProductID") {returnString += `${element}: ${jsonObject[element]} `}
        else if (element != "top") {returnString += `\n\t${element}: ${jsonObject[element]} `}
    })
    returnString += "\n"
    return returnString
}

async function validateOrder(dialogSet,filledOrder){
    var missingValues = []
    for (const value of Object.keys(dialogSet)){
        if (!(value in filledOrder)) {
            missingValues.push(value)
        }
    }
    if (missingValues.length == 0){return true}
    else {return missingValues}
}

async function fillOrder(entities){
    for (const value of Object.keys(entities)){
        OrderTemplate[value] = entities[value]
    }
    return OrderTemplate
}

function capitalizeFirstLetter(entityName, string) {
    if (capitalized.indexOf(entityName)>-1){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    else {
        return string
    }
}

async function replaceValues(string,object,dialogSet){
    var reg = /(?<=\{).+?(?=\})/gm;
    var found = string.match(reg)
    newString = string
    for (const value of found){
        if (object[value]){
            var replacement = capitalizeFirstLetter(value, object[value])
        }
        else if (dialogSet.defaultForOptional){
            var replacement = dialogSet.defaultForOptional[value] || ""
        }
        else {
            var replacement = ""
        }

        var newString = newString.replace(`{${value}}`,replacement)
    }
    return newString
}

async function removeRepeat(text){
    var reg =/-\d$/gm;
    var found = text.match(reg);
    if (found==null) return text
    else {
        returnText = text.replace(found, "")
        return returnText
    }
}

async function combineAllMissingEntities (requestedList,Missing){
    resultString = ""
    for (const value of Missing){
        resultString += requestedList[value] + "\n"
    }
    return resultString
}


Handler.confirmation = async function (dialogSet, intent, entities, response) {
    var filledOrder = await fillOrder(entities)
    var responseString = await replaceValues(dialogSet.confirmationMessage,filledOrder, dialogSet)
    return responseString
}


Handler.order = async function (dialogSet, intent, entities, response) {
    var filledOrder = await fillOrder(entities)
    var notMissing = await validateOrder(dialogSet.reqEntityRequest,filledOrder)
    if (notMissing == true) {
        // entities = []
        var responseString = await replaceValues(await randomResponse(dialogSet),filledOrder, dialogSet)
        return responseString
    }
    else {
        var responseString = await combineAllMissingEntities(dialogSet.reqEntityRequest,notMissing)
        return responseString
    }
}

Handler.search = async function (dialogSet, intent, entities, response) {
    if (Object.keys(entities).length == 0) {return dialogSet.failResponse}
    var results = []
    var returnString = await randomResponse(dialogSet)
    var jsonArray = await loadData()
    results = jsonArray
    var removedEntities = {}
    for (const key of Object.keys(entities)){
        if ( dialogSet.searchFields.indexOf(key.split("-")[0])==-1){
            removedEntities[key] = entities[key]
            delete entities[key]
        }
    }
    for (const entity of Object.keys(entities)) {
        if (entity.indexOf("metrics")>-1) {
            newKey = entity.split("metrics")
            searchField = entities[entity]
            searchValue = removedEntities['sys-number'+newKey[1]]
            curSymb = removedEntities[`comparison`+newKey[1]]
        } else {
            searchField = await removeRepeat(entity)
            searchValue = entities[entity]
            curSymb = 'None'
        }
        if (searchValue){
            console.log(searchField,searchValue,curSymb)
            results = await getDataFromDB(results,searchField,searchValue,curSymb)
        }
    }
    for (const value of results){
        returnString += await jsonToTemplate(value)
        returnString += "\n"
    }
    //console.log("results: ", results)
    if (results.length == 0) { return dialogSet.failResponse}
    for (const key of Object.keys(entities)){
        if ( dialogSet.entitiesToSave.indexOf(key.split("-")[0])==-1){
            delete entities[key]
        }
    }
    return returnString
}

Handler.response = async function (dialogSet, intent, entities, response){
    text = await randomResponse(dialogSet)
    // for (const entity of Object.keys(entities)){
    //     text = text.replace(`{${entity}}`,`${entities[entity]}`)
    // }
    text = await replaceValues(text,entities, dialogSet)
    return text
}

Handler.topOffers = async function (dialogSet, intent, entities, response){
    var jsonArray = await loadData()
    results = await getDataFromDB(jsonArray,"top","true")

    var returnString = dialogSet.response
    for (const value of results){
        returnString += await jsonToTemplate(value)
        returnString += "\n"
    }
    if (results.length == 0) { return dialogSet.failResponse}
    return returnString

}

async function getDataFromDB(db,fieldName,fieldValue,compare){
    // Should be DB query generation CSV read for POC
    var resultList = []
    async function find() {
        db.forEach((object) => {
            switch(compare) {
                case "less" : 
                    if (Number(object[fieldName]) <= Number(fieldValue)){ resultList.push(object) };
                    break;
                case "more" :
                    if (Number(object[fieldName]) >= Number(fieldValue)){ resultList.push(object) };
                    break;
                default:
                    if (fieldValue.toLowerCase().indexOf(object[fieldName].toLowerCase()) > -1){resultList.push(object)};
                    break;
            }
        })
    }
    await find()
    return resultList
}

module.exports = Handler