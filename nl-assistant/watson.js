// Example 1: sets up service wrapper, sends initial message, and 
// receives response.

var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var config = require('../conf/config')

// Set up Assistant service wrapper.
var service = new AssistantV1({
  username: config.watson.username, // replace with service username
  password: config.watson.password, // replace with service password
  version: config.watson.version
});

var workspace_id = config.watson.workspace_id; // replace with workspace ID



module.exports = function(newMessageFromUser,done) {
    newMessageFromUser = newMessageFromUser.replace("\n","|n")
    service.message({
        workspace_id: workspace_id,
        input: { text: newMessageFromUser }
        }, done)

 };