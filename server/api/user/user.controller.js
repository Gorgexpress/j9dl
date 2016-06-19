var User = require('./user.model');

var users = {
  20: 'Deadprez',
  25: 'vlv'
};

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
    return users[id];
  },
  setName: function(id, name) {
    users[id] = name;
  },
  isOnline: function(id) {
    return users[id] ? true : false;
  },
  listOnline: function() {
    return users;
  }
};
