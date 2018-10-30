const csv=require('csvtojson')
const lampCsvFilePath='./knowledgeDB/lamp.csv'
const kettleCsvFilePath='./knowledgeDB/kettle.csv'
const hddCsvFilePath='./knowledgeDB/hdd.csv'

async function loadData () {
    var lampArray = await csv().fromFile(lampCsvFilePath)
    var kettleArray = await csv().fromFile(kettleCsvFilePath)
    var hddArray = await csv().fromFile(hddCsvFilePath)

    return lampArray.concat(kettleArray,hddArray)
}

OrderTemplate = {}

Handler = {}

Handler.entities = []

async function jsonToTemplate (jsonObject) {
    var returnString = ""
    Object.keys(jsonObject).forEach(element => {
        if (element != "top") {returnString += `${element} : ${jsonObject[element]} `}
    })
    returnString += ", "
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

async function replaceValues(string,object){
    var reg = /(?<=\{).+?(?=\})/gm;
    var found = string.match(reg)
    newString = string
    for (const value of found){
        var newString = newString.replace(`{${value}}`,object[value])
    }
    return newString
}

async function combineAllMissingEntities (requestedList,Missing){
    resultString = ""
    for (const value of Missing){
        resultString += requestedList[value] + "\n"
    }
    return resultString
}


Handler.order = async function (dialogSet, intent, entities, response) {
    var filledOrder = await fillOrder(entities)
    var notMissing = await validateOrder(dialogSet.reqEntityRequest,filledOrder)
    if (notMissing == true) {
        // entities = []
        var responseString = await replaceValues(dialogSet.completionConfirmation,filledOrder)
        return responseString
    }
    else {
        var responseString = await combineAllMissingEntities(dialogSet.reqEntityRequest,notMissing)
        return responseString
    }
}

Handler.search = async function (dialogSet, intent, entities, response) {
    var results = []
    var returnString = dialogSet.response
    var jsonArray = await loadData()
    results = jsonArray
    for (const entity of Object.keys(entities)) {
        results = await getDataFromDB(results,entity,response.entities[entity])
    }
    for (const value of results){
        returnString += await jsonToTemplate(value)
        returnString += "\n"
    }
    if (results.length == 0) { return dialogSet.failResponse}
    return returnString
}

Handler.response = async function (dialogSet, intent, entities, response){
    return dialogSet.response
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

async function getDataFromDB(db,fieldName,fieldValue){
    // Should be DB query generation CSV read for POC
    var resultList = []
    async function find() {
        db.forEach((object) => {
            if (object[fieldName] == fieldValue){
                resultList.push(object)
            }
        })
    }
    await find()
    return resultList
}

module.exports = Handler