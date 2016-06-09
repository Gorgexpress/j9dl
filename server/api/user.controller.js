var User = require('./user.model');

var users = {
  20: 'Deadprez',
  25: 'vlv'
};

module.exports = {
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
