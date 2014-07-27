// web.js
var express = require("express");
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  // res.send('The start of Football Club Manager!');
  res.render("players", {
    players : [{
        "id" : 1,
        "firstName" : "Bo",
        "lastName" : "Zhu",
        "latestEndurance" : 3,
        "latestSpeed" : 4,
        "latestDribble" : 4,
        "latestPass" : 4,
        "latestDefense" : 5,
        "latestShoot" : 5,
        "latestStrength" : 3,
        "latestOverallAbility" : 90
      }
    ]
  });
});

var port = Number(process.env.PORT || 81);
app.listen(port, function () {
  console.log("Listening on " + port);
});
