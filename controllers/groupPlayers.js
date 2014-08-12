exports.group = function (req, res) {
    res.render("group", {
      numbers : req.query.groups,
      players : req.query.players
    });
}
