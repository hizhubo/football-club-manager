var rest = require('restler');

exports.group = function (req, res) {
  var body = {
    "groupNumber" : req.query.groups,
    "players" : req.query.players
  };
  rest.post(global.apiroot + '/groupPlayer', {
    data : body
  }).once('complete', function (data, response) {
    if (response.statusCode == 200) {
      res.render("group", {
        groups : data,
      });
    }
  });
}
