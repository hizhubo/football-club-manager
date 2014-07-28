// web.js
var async = require('async');
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var db = require('./models');
var bodyParser = require('body-parser');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 81);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

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

app.get('/api', function (req, res) {
  res.send("API is running.");
});

app.post('/api/player', function (req, res) {
  addPlayer(req.body, function (error) {
    if (!error) {
      res.send("Player created");
    } else {
      res.send(error);
    }
  });
});

// add order to the database if it doesn't already exist
var addPlayer = function (player_obj, callback) {
  var player = player_obj.player; // order json from coinbase
  var Player = global.db.Player;

  // find if player has already been added to our database
  Player.find({
    where : {
      id : player.id
    }
  }).success(function (player_instance) {
    if (player_instance) {
      // player already exists, do nothing
      callback();
    } else {
      // build instance and save
      var new_player_instance = Player.build({
          id : player.id,
          firstName : player.firstName,
          lastName : player.lastName,
          email : player.email,
          password : player.password,
          mobile : player.mobile,
          wechat : player.wechat,
          favoritePosition : player.favoritePosition,
          latestEndurance : player.latestEndurance,
          latestSpeed : player.latestSpeed,
          latestDribble : player.latestDribble,
          latestPass : player.latestPass,
          latestDefense : player.latestDefense,
          latestShoot : player.latestShoot,
          latestStrength : player.latestStrength,
          latestOverallAbility : player.latestOverallAbility
        });
      new_player_instance.save().success(function () {
        callback();
      }).error(function (err) {
        callback(err);
      });
    }
  });
};

// sync the database and start the server
db.sequelize.sync().complete(function (err) {
  if (err) {
    throw err;
  } else {
    http.createServer(app).listen(app.get('port'), function () {
      console.log("Listening on " + app.get('port'));
    });
  }
});
