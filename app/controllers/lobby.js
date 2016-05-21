var data = require('../../config/data.js');

module.exports = {
  list: function(req, res, next) {
    res.status(200).json(Object.keys(data.lobbies));
  },

  create: function(req, res, next) {
    if (data.lobbies[req.params.name])
      res.status(409).send({});
    else{data.lobbies[req.params.name] = {
      'players': [],
      'forbid': []
    };
    res.send({});
    }
  },

  get: function(req, res, next) {
    var playerIds = data.lobbies[req.params.lobby].players;
    var users = {};
    playerIds.forEach(function(id) {
      users[data.users[id]] = id;
    })
    res.status(200).json(users);
  }
};
