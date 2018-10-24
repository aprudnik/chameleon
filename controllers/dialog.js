const csvFilePath='./knowledgeDB/light.csv'
const csv=require('csvtojson')

responses = {}
responses['Order'] = {}
responses['Greeting'] = "Hello I am Chat Bot! How can I help you?"
responses['Light'] = "I have a lot of bulbs"
responses['None'] = "Sorry I don't understand, can you rephrase?"
responses['Question'] = "Can you please specify a product on what you need information?"
responses.Order['done'] = "We have registered your order request!"
responses.Order['noData'] = "Can you please provide your Name and Product ID you want to order"

var jsonArray
var lastIntent

orderTemplate={}
orderTemplate['productID'] = null
orderTemplate['Name'] = null

async function validateTemplate() {
    var status = true
    Object.keys(orderTemplate).forEach((key) => {
        if (orderTemplate[key] == null) {
            status = false
        }
    })
    return status
}


async function getDataFromDB(db,params){
    // Should be DB query generation CSV read for POC
    var resultList = []
    db.forEach((object) => {
        if (params.Socket == object.Socket && params['sys-number'] == object.Price){
            resultList.push(object)
        } else if (params.Socket == object.Socket) {
            resultList.push(object)
        } else if (params['sys-number'] == Number(object.Price)){
            resultList.push(object)
        }
    })
    return resultList
}

async function dialogFlow(body) {
    jsonArray = await csv().fromFile(csvFilePath)
    resultObjects =[]
    if (body.intent == 'None') {body.intent = lastIntent}
    lastIntent = body.intent
    if (body.intent == "Question"){
        if (Object.keys(body.entities).length){
            resultObjects = await getDataFromDB(jsonArray,body.entities)
            return `I have found ${resultObjects.length} results : ${JSON.stringify(resultObjects, null, 4)}`
        } else {
            return responses[body.intent]
        }
    }
    if (body.intent == "Order") {
        if (Object.keys(body.entities).indexOf('name') > -1){
            orderTemplate['Name'] = body.entities['name']
        }

        if (Object.keys(body.entities).indexOf('productID') > -1){
            orderTemplate['productID'] = body.entities['productID']
        }
        
        templateStatus = await validateTemplate()
        if (templateStatus) {
            var responseString = `${responses[body.intent]['done']} Request details : Name - ${orderTemplate['Name']} and Product - ${orderTemplate['productID']}`
            orderTemplate = {}
            return responseString
        } else {
            return responses.Order['noData']
        }
    } 
    
    return responses['None']
}


module.exports = async (body,res) => {
    if (Object.keys(responses).indexOf(body.intent) > -1){
        answer = await dialogFlow(body)
        console.log(answer)
        res(answer)
    } else {
        console.log('Keys not found')
        res('Keys not Found')
    }
}