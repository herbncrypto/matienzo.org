const request = require('request');

exports.handler = function(event, context, callback) {
  var e = JSON.parse(event.body);
  // if (process.env.SUPERFEEDR_USERNAME) {
    if (e.payload.context == "production") {
      console.log("[superfeedr] preparing to ping")
      request.post(
        `http://anarchivist.superfeedr.com/?hub.mode=publish&hub.url=${e.payload.url}/*`,
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
  // } else {
  //   callback("Superfeedr username is not set", {statusCode: 500});
  // }
}
