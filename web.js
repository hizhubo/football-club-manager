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
    extended : true
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

app.get('/api/players', function (req, res) {
  global.db.Player.findAll().success(function (players) {
    var players_json = [];
    players.forEach(function (player) {
      players_json.push({
        id : player.id,
        number : player.number,
        firstName : player.firstName,
        lastName : player.lastName,
        chsName : player.chsName,
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
    });
    res.send(players_json);
  }).error(function (err) {
    console.log(err);
    res.status(500).send("Error retrieving players.");
  });
});

app.get('/api/player/:id', function (req, res) {
  global.db.Player.find({
    where : {
      id : req.params.id
    }
  }).success(function (player_instance) {
    if (!player_instance) {
      res.status(404).send("Player doesn't exist.");
    } else {
      var players_json = [];
      players_json.push({
        id : player_instance.id,
        number : player_instance.number,
        firstName : player_instance.firstName,
        lastName : player_instance.lastName,
        chsName : player_instance.chsName,
        email : player_instance.email,
        mobile : player_instance.mobile,
        wechat : player_instance.wechat,
        favoritePosition : player_instance.favoritePosition,
        latestEndurance : player_instance.latestEndurance,
        latestSpeed : player_instance.latestSpeed,
        latestDribble : player_instance.latestDribble,
        latestPass : player_instance.latestPass,
        latestDefense : player_instance.latestDefense,
        latestShoot : player_instance.latestShoot,
        latestStrength : player_instance.latestStrength,
        latestOverallAbility : player_instance.latestOverallAbility
      });
      res.send(players_json);
    }
  }).error(function (err) {
    console.log(err);
    res.status(500).send("Error retrieving player.");
  });
});

app.post('/api/player', function (req, res) {
  addPlayer(req.body, function (err) {
    if (!err) {
      res.send("Player created");
    } else {
      switch (err) {
      case "Player already exists.":
        res.status(409).send(err);
        break;
      default:
        console.log(err);
        res.status(500).send("Error creating player.");
        break;
      }
    }
  });
});

app.put('/api/player', function (req, res) {
  updatePlayer(req.body, function (err) {
    if (!err) {
      res.send("Player updated.");
    } else {
      switch (err) {
      case "Player doesn't exist.":
        res.status(404).send(err);
        break;
      default:
        console.log(err);
        res.status(500).send("Error updating player.");
        break;
      }
    }
  });
});

app.delete('/api/player/:id', function (req, res) {
  global.db.Player.find({
    where : {
      id : req.params.id
    }
  }).success(function (player_instance) {
    if (!player_instance) {
      res.status(404).send("Player to delete doesn't exist.");
    } else {
      player_instance.destroy().success(function () {
        res.send("Player deleted.");
      }).error(function (err) {
        console.log(err);
        res.status(500).send("Error deleting player.");
      });
    }
  }).error(function (err) {
    console.log(err);
    res.status(500).send("Error deleting player.");
  });
});

// add player to the database if it doesn't already exist.
var addPlayer = function (player_obj, callback) {
  var player = player_obj.player;
  var Player = global.db.Player;

  // find if player has already been added to our database
  Player.find({
    where : {
      email : player.email
    }
  }).success(function (player_instance) {
    if (player_instance) {
      // player already exists, send back error.
      callback("Player already exists.");
    } else {
      // build instance and save
      var new_player_instance = Player.build({
          number : player.number,
          firstName : player.firstName,
          lastName : player.lastName,
          chsName : player.chsName,
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

// update player if it exists.
var updatePlayer = function (player_obj, callback) {
  var player = player_obj.player;
  var Player = global.db.Player;

  // find if player has already been added to our database
  Player.find({
    where : {
      id : player.id
    }
  }).success(function (player_instance) {
    if (!player_instance) {
      callback("Player doesn't exist.");
    } else {
      player_instance.updateAttributes({
        number : player.number,
        firstName : player.firstName,
        lastName : player.lastName,
        chsName : player.chsName,
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
      }).success(function () {
        callback();
      }).error(function (err) {
        callback(err);
      });
    }
  });
}

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
