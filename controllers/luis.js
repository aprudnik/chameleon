const request = require('request');
var config = require('../config')

const GetIntent = (text, callback)  => {
    url_to_send = config.luis.url + text

    request({
        url: url_to_send,
        method: 'GET'
        },
        function (error, response, body) {
            callback(error, body);
            return body
          }
          )

};

module.exports = (text, response) => {
    GetIntent(text, response)
}
