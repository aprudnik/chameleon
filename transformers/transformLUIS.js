const request = require('request');
var config = require('../conf/config')
const getExamples = require('../controllers/getExamples');

 

url = config.luis.apiURL

const return_response = (error, response, body) => {
    console.log(error, body)
}




const createLuisVar= (type, name, callback)  => {
    url_to_send = url + type + config.luis.subscriptionKey
    request.post({
        url: url_to_send,
        form: {"name": name}
        },
        function (error, response, body) {
            callback(error, "", body);
            return body
          })
};


const createLuisClosedList= (name, valueList, callback)  => {
    url_to_send = url + `closedlists` + config.luis.subscriptionKey
    sublist = []
    Object.keys(valueList).forEach(item =>{
        sublist.push({
			"canonicalForm": item,
			"list": valueList[item]
		})
    })
    body = {"name": name,
        "sublists": sublist
        }
    
    console.log(sublist[0].list)
    request.post({
        url: url_to_send,
        body: body,
        json: true
        },
        function (error, response, body) {
            callback(error, "", body);
            return body
          })
};

const publishLuis= (versionId, location, callback)  => {
    url_to_send = config.luis.publishURL + config.luis.subscriptionKey
    form = {
        "versionId": versionId,
        "isStaging": "false",
        "region": location
     }
    request.post({
        url: url_to_send,
        form: form
        },
        function (error, response, body) {
            callback(error, "", body);
            return body
          }
          )

};

const addExample = (text, Intent_name, entityList) => {

    luisForm = {}
    luisForm["text"] = text;
    luisForm["intentName"] = Intent_name;
    luisForm["entityLabels"] = [];
    if (entityList.length>0){
        entityList.forEach(entityValue => {
            entityValue = entityValue.split("-")
            entity = {}
            entity["entityName"] = entityValue[0];
            entity["startCharIndex"] = entityValue[1];
            entity["endCharIndex"] = entityValue[2];
            luisForm["entityLabels"].push(entity)
        });
    }
    return luisForm

}





async function runLoop(callback) {
    initial = getExamples.getJson()
    Object.keys(initial["Entities"]).forEach((entity,index0) =>{
        if (Array.isArray(initial["Entities"][entity])){
            setTimeout(function(){createLuisVar("Entities", entity, return_response)}, index0*500)
        } else {
            setTimeout(function(){createLuisClosedList(entity, initial["Entities"][entity], return_response)}, index0*500)
        }
    })
    setTimeout(function(){
        jsonToSend = []
        initial["Intents"].forEach((value, index1) => {
            setTimeout(function(){createLuisVar("Intents", value["Name"], return_response)}, 500*index1)
            value["Examples"].forEach((example) =>{
                listToSend = getExamples.makeList(initial["Entities"], example)
                listToSend.forEach((textToSend) => {
                        jsonToSend.push(addExample(textToSend[0], value["Name"], textToSend.slice(1), return_response));
                })
            })
        })
        callback(jsonToSend)
    }, Object.keys(initial["Entities"])*500)  
}

function waitPublish(){
    url_to_send = config.luis.apiURL + `train`+ config.luis.subscriptionKey
    request.get(url_to_send, function(error, response, body){
        if (JSON.parse(body)[0]["details"]["status"] != "Success"){
            setTimeout(function(){
                waitPublish()
                console.log("Waiting 1 sec for training to finish")
            }, 1000)
        } else {
            publishLuis("0.1", "westus", return_response)
        }
    })
}

async function trainLuis(callback) {
    await runLoop(function(toSend){
        //console.log(toSend)
        setTimeout(function(){
            url_to_send = url + `examples` + `?subscription-key=e17b1f8d66d3410abadc94ac2ceb1ce9`
            
            //console.log(JSON.stringify(toSend))
            request.post({
                url: url_to_send,
                body : JSON.stringify(toSend)
            },
            function(error, response, body){
                
                createLuisVar("Train", "", function(error, response, body){
                    waitPublish()
                    //
                })
                callback(error, response, body)
            })
        }, 1000*( Object.keys(initial["Entities"]).length + initial["Intents"].length))
    })
}

main = () => {
    trainLuis(return_response)
}

main()

