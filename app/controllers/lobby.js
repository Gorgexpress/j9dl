var data = require('../../config/data.js');
var sio = null;
module.exports = {
  init: function(io) {
    sio = io;

  },

  list: function(req, res, next) {
    res.status(200).json(Object.keys(data.lobbies));
  },

  create: function(req, res, next) {
    if (data.lobbies[req.params.name])
      res.status(409).send({});
    else{data.lobbies[req.params.name] = {
      'players': [req.session.userid],
      'forbid': [],
      'host': req.session.userid 
    };
    req.session.lobby = req.params.name;
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
  },

  join: function(req, res, next) {
    var lobbyData = data.lobbies[req.params.lobby];
    if (!lobbyData)
      res.status(500).json("Lobby not found");
    else if (req.session.lobby) //user should not be able to join a lobby while already in one
      res.status(500).json("Already in lobby");
    else {
      lobbyData.players.push(req.session.userid);
      req.session.lobby = req.params.lobby;
      res.status(200).json("Joined lobby" + req.params.lobby);
    }
  },

  leave: function(req, res, next) {
    if (!req.session.lobby) //if the session says the client isn't in a lobby, do nothing.
      res.status(500).json("Lobby variable in session is null");
    else {
      var lobby = req.session.lobby;
      var lobbyData = data.lobbies[lobby];
      req.session.lobby = null;
      if (!lobbyData) //do nothing if lobby does not exist
        res.status(500).json("Lobby not found");
      else if (lobbyData.host === req.session.userid){ //disband lobby if the host left
        delete data.lobbies[lobby];
        res.status(200).json("Lobby disbanded");
        sio.sockets.emit('lobby ended', lobby);
      }
      else {
        var index = lobbyData.players.indexOf(req.session.userid);
        if (index < 0) //Do nothing if our client isn't actually in the lobby it says it is in
          res.status(500).json("Not in lobby");
        lobbyData.players.splice(index, 1);
        if(lobbyData.players.length === 0){ //if lobby is now empty, remove it.
          delete data.lobbies[lobby];
          res.status(200).json("Lobby disbanded");
        }
        else
          res.status(200).json({});
      }
    }
  }
};
