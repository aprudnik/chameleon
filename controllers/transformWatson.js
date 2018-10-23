var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var config = require('../config')
const fs = require('fs');
const getExamples = require("./getExamples")



initial = getExamples.getJson()

var service = new AssistantV1({
    username: config.watson.username, 
    password: config.watson.password,
    version: config.watson.version
  });

initial["Intents"].forEach(intent => {
    examples = []
    
    intent["Examples"].forEach(example => {
        modText = getExamples.makeList(initial["Entities"], example)
        modText.forEach(text => {
            examples.push({"text": text[0]})
        })
    })
    var params = {
        workspace_id: config.watson.workspace_id,
        intent: intent["Name"],
        examples: examples
      };
      service.createIntent(params, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
});

Object.keys(initial["Entities"]).forEach(entity => {
    values = []
    initial["Entities"][entity].forEach(value =>{
        values.push({"value" : value})
    })
    var params = {
        workspace_id: config.watson.workspace_id,
        entity: entity,
        values: values
      };

      service.createEntity(params, function(err, response) {
        if (err) {
          console.error(err);
        } else {
          console.log(JSON.stringify(response,null, 2));
        } 
      });
})