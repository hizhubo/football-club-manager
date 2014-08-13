exports.api = function (req, res) {
  res.send("API is running.");
}

exports.getPlayers = function (req, res) {
  global.db.Player.findAll({
    order : [['latestOverallAbility', 'DESC'], ['firstName', 'ASC']]
  }).success(function (players) {
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
}

exports.getPlayer = function (req, res) {
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
}

exports.addPlayer = function (req, res) {
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
}

exports.updatePlayer = function (req, res) {
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
}

exports.deletePlayer = function (req, res) {
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
}

exports.groupPlayer = function (req, res) {
  var groupNumber = req.body.groupNumber;
  var playerIds = req.body.players;
  var players = playerIds.split(",");

  // Hard-coding for now. Should be replaced by intelligent grouping.
  var groupPlans = 2;

  global.db.Player.findAll({
    where : {
      id : players
    },
    order : [['latestOverallAbility', 'DESC'], ['firstName', 'ASC']]
  }).success(function (players) {
    var players_json = [];

    players.forEach(function (player) {
      players_json.push({
        id : player.id,
        firstName : player.firstName,
        lastName : player.lastName,
        chsName : player.chsName,
        latestOverallAbility : player.latestOverallAbility
      });
    });

    var groupings = [];
    var playersInEachGroup = Math.round(players_json.length / groupNumber);

    for (var i = 0; i < groupPlans; i++) {
      var shuffledPlayers = shuffle(players_json);
      var grouping = [];

      for (var j = 0; j < groupNumber; j++) {
        var start = j * playersInEachGroup;
        var end = start + playersInEachGroup;

        if (j < groupNumber - 1) {
          grouping.push(shuffledPlayers.slice(start, end));
        } else {
          // The last group should contain the rest players.
          grouping.push(shuffledPlayers.slice(start));
        }
      }

      groupings.push(grouping);
    }

    res.send(groupings);
  }).error(function (err) {
    console.log(err);
    res.status(500).send("Error retrieving players.");
  });
}

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

var shuffle = function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

  return o;
}
