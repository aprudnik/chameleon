// Example 1: sets up service wrapper, sends initial message, and 
// receives response.

var AssistantV1 = require('watson-developer-cloud/assistant/v1');

// Set up Assistant service wrapper.
var service = new AssistantV1({
  username: '095c9c0f-24fb-4269-bb43-7038377b6a98', // replace with service username
  password: 'ooYfoLy4eMAJ', // replace with service password
  version: '2018-07-10'
});

var workspace_id = 'ff9fa0f0-beb9-4008-b009-f1cc6af5fe51'; // replace with workspace ID

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
      console.log(response.output.generic[0].text)
      return response.output.generic[0].text
  }
}

module.exports = (newMessageFromUser) => {
    service.message({
        workspace_id: workspace_id,
        input: { text: newMessageFromUser }
        }, processResponse)
 };