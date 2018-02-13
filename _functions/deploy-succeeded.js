const request = require('request');
const toml = require('toml');
const config = toml.parse(fs.readFileSync('netlify.toml'));
const SUPERFEEDR_USERNAME = process.env.SUPERFEEDR_USERNAME !== undefined
  ? process.env.SUPERFEEDR_USERNAME
  : config.context.production.environment.SUPERFEEDR_USERNAME;

exports.handler = function(event, context, callback) {
  var e = JSON.parse(event.body);
  if (e.payload.context == "production") {
    console.log(`[superfeedr] preparing to ping ${SUPERFEEDR_USERNAME}.superfeedr.com`)
    request.post(
      `http://${SUPERFEEDR_USERNAME}.superfeedr.com/?hub.mode=publish&hub.url=${e.payload.url}/*`,
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
}
