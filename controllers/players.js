var rest = require('restler');

exports.index = function (req, res) {
  rest.get(global.apiroot + '/players').once('complete', function (data) {
    // Uses views/players.ejs
    res.render("players", {
      players : data
    });
  });
}

exports.players = function (req, res) {
  rest.get(global.apiroot + '/players').once('complete', function (data) {
    // Uses views/players.ejs
    res.render("players", {
      players : data
    });
  });
}

exports.addPlayer = function (req, res) {
  res.render("add-player", {
    player : [{
        number : '',
        firstName : '',
        lastName : '',
        chsName : '',
        email : '',
        mobile : '',
        wechat : '',
        favoritePosition : '',
        latestEndurance : 1,
        latestSpeed : 1,
        latestDribble : 1,
        latestPass : 1,
        latestDefense : 1,
        latestShoot : 1,
        latestStrength : 1,
        latestOverallAbility : 1
      }
    ]
  });
}

exports.addPlayerSpecifiedId = function (req, res) {
  rest.get(global.apiroot + '/player/' + req.params.id).once('complete', function (data) {
    // Uses views/players.ejs
    res.render("add-player", {
      player : data
    });
  });
}

exports.savePlayer = function (req, res) {
  var body = {
    "player" : {
      number : req.body.textinputNumber,
      firstName : req.body.textinputFirstName,
      lastName : req.body.textinputLastName,
      chsName : req.body.textinputChsName,
      email : req.body.textinputEmail,
      mobile : req.body.textinputMobile,
      wechat : req.body.textinputWechat,
      favoritePosition : req.body.selectFavoritePosition,
      latestEndurance : req.body.sliderEndurance,
      latestSpeed : req.body.sliderSpeed,
      latestDribble : req.body.sliderDribble,
      latestPass : req.body.sliderPass,
      latestDefense : req.body.sliderDefense,
      latestShoot : req.body.sliderShoot,
      latestStrength : req.body.sliderStrength,
      latestOverallAbility : parseInt((req.body.sliderEndurance * global.weightEndurance + req.body.sliderSpeed * global.weightSpeed + req.body.sliderDribble * global.weightDribble + req.body.sliderPass * global.weightPass + req.body.sliderDefense * global.weightDefense + req.body.sliderShoot * global.weightShoot + req.body.sliderStrength * global.weightStrength) * 20)
    }
  };

  if (req.body.hiddenId > 0) {
    body.player.id = req.body.hiddenId;
    rest.put(global.apiroot + '/player', {
      data : body
    }).once('complete', function (data, response) {
      if (response.statusCode == 200) {
        res.redirect(global.webroot + '/players');
      }
    });
  } else {
    rest.post(global.apiroot + '/player', {
      data : body
    }).once('complete', function (data, response) {
      if (response.statusCode == 200) {
        res.redirect(global.webroot + '/players');
      }
    });
  }
}