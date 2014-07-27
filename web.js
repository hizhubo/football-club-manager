// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function (req, res) {
  res.send('The start of Football Club Manager!');
});

var port = Number(process.env.PORT || 81);
app.listen(port, function () {
  console.log("Listening on " + port);
});
