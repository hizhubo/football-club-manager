// web.js
var async = require('async');
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var db = require('./models');
var playersApi = require('./controllers/playersApi');
var players = require('./controllers/players');
var bodyParser = require('body-parser');
var rest = require('restler');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 81);
app.use(bodyParser.urlencoded({
    extended : true
  }));
app.use(bodyParser.json())
app.disable('etag');

// Index page
app.get('/', players.index);

// Players pages
app.get('/players', players.players);
app.get('/add-player', players.addPlayer);
app.get('/add-player/:id', players.addPlayerSpecifiedId);
app.post('/add-player', players.savePlayer);

// Players API
app.get('/api', playersApi.api);
app.get('/api/players', playersApi.getPlayers);
app.get('/api/player/:id', playersApi.getPlayer);
app.post('/api/player', playersApi.addPlayer);
app.put('/api/player', playersApi.updatePlayer);
app.delete('/api/player/:id', playersApi.deletePlayer);

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
