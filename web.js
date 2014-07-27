// web.js
var async = require('async');
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var db = require('./models');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 81);

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

// Render example.com/players
app.get('/players', function (request, response) {
  global.db.Player.findAll().success(function (players) {
    var players_json = [];
    players.forEach(function (player) {
      players_json.push({
        id : player.id,
        firstName : player.firstName,
        lastName : player.lastName,
        latestEndurance : player.latestEndurance,
        latestSpeed : player.latestSpeed,
        latestDribble : player.latestDribble,
        latestPass : player.latestPass,
        latestDefense : player.latestDefense,
        latestShoot : player.latestShoot,
        latestStrength : player.latestStrength,
        latestOverallAbility : player.latestOverallAbility
      });
    });

    // Uses views/players.ejs
    response.render("players", {
      players : players_json
    });
  }).error(function (err) {
    console.log(err);
    response.send("error retrieving players");
  });
});

app.get('/add-player', function (req, res) {
  // res.send('The start of Football Club Manager!');
  res.render("add-player", {
    player : [{
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

// sync the database and start the server
db.sequelize.sync().complete(function(err) {
  if (err) {
    throw err;
  } else {
    http.createServer(app).listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
    });
  }
});
