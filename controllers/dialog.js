const csvFilePath='../knowledgeDB/light.csv'
const csv=require('csvtojson')

responses = {}
responses['Greeting'] = "Hello I am Chat Bot! How can I help you?"
responses['Light'] = "I have a lot of bulbs"
responses['None'] = "Sorry I don't understand, can you rephrase?"

var jsonArray
async function loadData() {
    jsonArray = await csv().fromFile(csvFilePath)
    console.log(jsonArray)
}

loadData()



function getDataFromDB(params,result){
    if (params.Socket){

    }
}

function dialogFlow(body,answer) {
    if (body.entities) {
        getDataFromDB(body.entities)
    }


}


module.exports = (body,res) => {
    console.log(responses[body.intent])
    res(responses[body.intent])
}