var LobbyEvents = require('./lobby.events');
var Rating = require('../rating/rating.model.js');

module.exports = function(io, socket) {
  'use strict';
  socket.on('l:new', function(lobby) {
    socket.broadcast.emit('l:new', lobby);
  });
  socket.on('l:join', function(lobby) {
    if (socket.room){
      socket.leave(socket.room);
      socket.broadcast.emit('l:left', socket.request.session.userid);
    }
    socket.join('l:' + lobby);
    socket.room = 'l:' + lobby;
    Rating.findOne({'userid': socket.request.session.userid}, function (err, rating) {
      if (!rating) {
        rating = new Rating({userid: socket.request.session.userid});
        rating.save();
      }
      var user = {
        'id': socket.request.session.userid,
        'name': socket.request.session.name,
        'role': 0,
        'mu': rating.mu
      };
      io.to(socket.room).emit('l:join', user);
      //sync join with other sockets in the same session
      socket.broadcast.to('u:' + socket.request.session.userid).emit('l:sjoin', lobby);
      socket.broadcast.emit('l:incCount', lobby); //increase playerCount in lobby list
    });
  });
  socket.on('l:left', function() {
    if (socket.room){
      socket.leave(socket.room);
      io.emit('l:decCount', socket.room.slice(2)); //decrease playerCount in lobby list, ignore the 'l:'
      socket.room = null;
      socket.broadcast.emit('l:left', socket.request.session.userid);
      //sync leave with other sockets in the same session
      socket.broadcast.to('u:' + socket.request.session.userid).emit('l:sleave');
    }
  });
  socket.on('l:start', function() {
    io.to(socket.room).emit('l:start');
  });
  socket.on('l:ready', function (userid) {
    socket.broadcast.to(socket.room).emit('l:ready', userid);
  });
  socket.on('l:unready', function (userid) {
    socket.broadcast.to(socket.room).emit('l:unready', userid);
  });
  socket.on('l:incCount', function (lobby) {
    io.emit('l:incCount', lobby);
  });
  socket.on('l:decCount', function (lobby) {
    io.emit('l:decCount', lobby);
  });
  //listener for disbanding lobby
  var listener = createListener('l:disband', socket);
  LobbyEvents.on('l:disband', listener);
  socket.on('disconnect', removeListener('l:disband', listener));
  //listener for enabling voting for the winner
  // TODO? Ideally this is only emitted to people in the lobby that voting was just
  //enabled for. Currently, it emits to every socket and the client does the rest of the work.
  //Shouldn't be a huge performance impact as this event won't happen often.
  var listener2 = createListener('l:enableVote', socket);
  LobbyEvents.on('l:enableVote', listener2);
  socket.on('disconnect', removeListener('l:enableVote', listener2));
};

var createListener = function (event, socket) {
  return function (doc) {
    socket.emit(event, doc);
  };
};

var removeListener = function (event, listener) {
  return function () {
    LobbyEvents.removeListener(event, listener);
  };
};
