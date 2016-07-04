var User = require('./user.model');

var users = {
  20: {name: 'Deadprez'},
  25: {name: 'vlv'},
  26: {name: 'pojo'},
  27: {name: 'shyrazn'}
};

//var users = {};

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
      users[id] = {'name': name};
  },
  isOnline: function(id) {
    return users[id] ? true : false;
  },
  listOnline: function() {
    return users;
  }
};
