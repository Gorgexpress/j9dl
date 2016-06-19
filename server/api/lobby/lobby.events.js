var EventEmitter = require('events');

var LobbyEvents = new EventEmitter();

//LobbyEvents.setMaxListeners(0);
LobbyEvents.setMaxListeners(10);

var events = {
  'disband': 'disband'
};

var emitEvent = function (event) {
  return function(doc) {
    LobbyEvents.emit(event, doc);
  };
};

module.exports = LobbyEvents;
