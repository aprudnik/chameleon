// Example 1: sets up service wrapper, sends initial message, and 
// receives response.

var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var config = require('../config')

// Set up Assistant service wrapper.
var service = new AssistantV1({
  username: config.watson.username, // replace with service username
  password: config.watson.password, // replace with service password
  version: config.watson.version
});

var workspace_id = config.watson.workspace_id; // replace with workspace ID

// Start conversation with empty message.
// service.message({
//   workspace_id: workspace_id
//   }, processResponse);

// Process the service response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  // Display the output from dialog, if any. Assumes a single text response.
  if (response.output.generic.length != 0) {
    // console.log(response.output.generic[0].text)
    return response.output.generic[0].text
  }
}

module.exports = function(newMessageFromUser,done) {
     service.message({
        workspace_id: workspace_id,
        input: { text: newMessageFromUser }
        }, done)
 };