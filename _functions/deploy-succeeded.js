const request = require('request');

exports.handler = function(event, context, callback) {
  var e = JSON.parse(event.body);
  console.log("event received:\n", JSON.stringify(e.payload, null, 2));
  console.log("[superfeedr] preparing to ping")
  request.post(
    `http://anarchivist.superfeedr.com/?hub.mode=publish&hub.url=https://matienzo.org/*`,
    function (error, response, body){
      if (!error && response.statusCode == 204) {
        console.log("[superfeedr] ping successful");
        callback(null, {statusCode: 204});
      } else {
        console.log("[superfeedr] ping failed:", error);
        callback(error, {statusCode: response.statusCode});
      }
    }
  );
}
