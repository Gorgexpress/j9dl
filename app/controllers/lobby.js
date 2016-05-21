var data = require('../../config/data.js');

module.exports = {
  list: function(req, res, next) {
    res.status(200).json(Object.keys(data.lobbies));
  },

  create: function(req, res, next) {
    data.lobbies.push(req.params.name)
    res.send({});
  },

  getLobby: function(req, res, next) {
    console.log(req.params.name);
    var playerIds = data.lobbies[req.params.name].players;
    var users = {};
    playerIds.forEach(function(id) {
      users[data.users[id]] = id;
    })
    res.status(200).json(users);
  }
};
