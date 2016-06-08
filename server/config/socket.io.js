var Lobby = require('../api/lobby.controller.js');

module.exports = function(server){
  var io = require('socket.io')(server);
  
  io.on('connection', function(socket) {
    socket.on('new lobby', function(lobby) {
      socket.broadcast.emit('new lobby', lobby);
    });
    socket.on('join lobby', function(lobby) {
      if (socket.room){
        socket.leave(socket.room);
        socket.broadcast.emit('user left');
      }
      socket.join(lobby);
      socket.room = lobby;
      var user = {
        name: socket.request.session.name,
        id: socket.request.session.id
      };
      io.to(lobby).emit('user joined', user);
    });
    socket.on('leave lobby', function() {
      if (socket.room){
        socket.leave(socket.room);
        socket.room = null;
        socket.broadcast.emit('user left', socket.request.session.name);
      }
    });
    socket.on('msg', function(msg) {
      io.emit('msg', socket.request.session.name + ": " + msg);
    });
    socket.on('disconnect', function() {
      if (socket.room) {
         Lobby.disconnect(socket.request.session.lobby, socket.request.session.userid);
      }
    });
    console.log('a user connected');
  });
  return io;
};
