import EventEmitter from 'events';

var LobbyEvents = new EventEmitter();

LobbyEvents.setMaxListeners(0);

var events = {
  'disband': 'disband'
};

var emitEvent = function (event) {
  return function(doc) {
    LobbyEvents.emit(event, doc);
  };
};

export default LobbyEvents;
