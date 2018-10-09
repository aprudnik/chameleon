const request = require('request');


const sendTextMessage = (query, callback)  => {
    text=query.message;
    url_to_send = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4fb9c915-be86-4951-b5ab-a2593798d264?subscription-key=e17b1f8d66d3410abadc94ac2ceb1ce9&timezoneOffset=-360&q=${text}`

    request({
        url: url_to_send,
        method: 'GET'
        },
        function (error, response, body) {
            
            callback(body);
            return body
          }
          )

};

module.exports = (text, response) => {
    sendTextMessage(text, response)

}
