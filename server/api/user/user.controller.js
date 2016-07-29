var User = require('./user.model');
var _ = require('lodash');
/*
var users = {
  20: {
    name: 'Deadprez',
    lobby: null
  },
  25: {
    name: 'vlv',
    lobby: null
  },
  26: {
    name: 'pojo',
    lobby: null
  },
  27: {
    name: 'shyrazn',
    lobby: null
  }
};
*/
var users = {};

module.exports = {
  getSelf: function(req, res, next) {
    var self = {
      'name': req.session.name,
      'userid': req.session.userid,
      'lobby': req.session.lobby
    };
    res.status(200).json(self);
  },
  getName: function(id) {
    return users[id].name;
  },
  setName: function(id, name) {
    if (users[id])
      users[id].name = name;
    else
      users[id] = {
        'name': name,
        lobby: null
      };
  },
  isOnline: function(id) {
    return users[id] ? true : false;
  },

  //delete the lobby variable for all user ids in the userids array
  unsetLobby: function(userids) {
    _.each(userids, function (userid) {
      users[userid].lobby = null;
    });
  },
  
  getActiveLobby: function(userid) {
    if (!users[userid] || !users[userid].lobby)
      return null;
    return users[userid].lobby;
  },
  //returns users object, not currently used.
  listOnline: function() {
    return users;
  }
};
