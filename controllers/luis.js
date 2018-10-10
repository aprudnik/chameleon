const request = require('request');
var config = require('../config')

const GetIntent = (query, callback)  => {
    text=query.message;
    url_to_send = config.luis.url + text

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
    GetIntent(text, response)
    
}
