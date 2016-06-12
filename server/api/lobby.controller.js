var OnlineUser = require('./user.controller.js');
var sio = null;

lobbies = {
  '-APEM pros only': {
    'players': [20],
    'forbid': [1000],
    'host': [20],
    'inProgress': false,
    'ready': []
  },
  'ARDM': {
    'players': [25],
    'forbid': [2000],
    'host': [25],
    'inProgress': false,
  }
};

module.exports = {
  init: function(io) {
    sio = io;
  },

  list: function(req, res, next) {
    res.status(200).json(Object.keys(lobbies));
  },

  create: function(req, res, next) {
    if (lobbies[req.params.name])
      res.status(409).send({});
    else{lobbies[req.params.name] = {
      'players': [req.session.userid],
      'forbid': [],
      'host': req.session.userid 
    };
    req.session.lobby = req.params.name;
    res.send({});
    }
  },

  get: function(req, res, next) {
    var playerIds = lobbies[req.params.lobby].players;
    var lobbyObject = {
      'host': lobbies[req.params.lobby].host,
      'users': {}
    };
    playerIds.forEach(function(id) {
      lobbyObject.users[id] = {
        'name': OnlineUser.getName(id),
        'role': 0
      };
    });
    res.status(200).json(lobbyObject);
  },

  join: function(req, res, next) {
    var lobbyData = lobbies[req.params.lobby];
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
      var lobbyData = lobbies[lobby];
      req.session.lobby = null;
      if (!lobbyData) //do nothing if lobby does not exist
        res.status(500).json("Lobby not found");
      else if (lobbyData.host === req.session.userid){ //disband lobby if the host left
        delete lobbies[lobby];
        res.status(200).json("Lobby disbanded");
        sio.sockets.emit('lobby ended', lobby);
      }
      else {
        var index = lobbyData.players.indexOf(req.session.userid);
        if (index < 0) //Do nothing if our client isn't actually in the lobby it says it is in
          res.status(500).json("Not in lobby");
        lobbyData.players.splice(index, 1);
        if(lobbyData.players.length === 0){ //if lobby is now empty, remove it.
          delete lobbies[lobby];
          res.status(200).json("Lobby disbanded");
          sio.sockets.emit('lobby ended', lobby);
        }
        else
          res.status(200).json({});
      }
    }
  },

  ready: function(req, res, next) {
    if (!req.session.lobby) {
      console.log(req.session.userid + " used ready from lobby api but no lobby variable is set in session");
      res.status(409).json({});
    }
    else if (!lobbies[req.session.lobby]) {
      console.log("lobby.ready, lobby not found. userid:" + req.session.userid);
      res.status(409).json({});
    }
    else if (lobbies[req.session.lobby].ready.indexOf(req.session.userid) > 0)
      res.status(409).json("Already ready");
    else {
      lobbies[req.session.lobby].ready.push(req.session.userid);
      res.status(200);
    }
  },

  unready: function(req, res, next) {
    if (!req.session.lobby) {
      console.log(req.session.userid + " used unready from lobby api but no lobby variable is set in session");
      res.status(409).json({});
    }
    else if (!lobbies[req.session.lobby]) {
      console.log("lobby.unready, lobby not found. userid:" + req.session.userid);
      res.status(409).json({});
    }
    else {
      var index = lobbies[req.session.lobby].ready.indexOf(req.session.userid);
      if (index < 0) {
        res.status(409).json("Not ready");
        console.log(req.session.userid + " used unready but was not found in ready array");
      }
      else {
        lobbies[req.session.lobby].ready.splice(index, 1);
        res.status(200);
      }
    }
  },

  disconnect: function(lobby, id) {
    if (lobbies[lobby])
      if (lobbies[lobby].players[id])
        delete lobbies[lobby].players[id];
  }
};
