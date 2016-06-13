var Lobby = require('../api/lobby.controller.js');
var sockets = {}; //maps session.userid to socket.id

module.exports = function(server){
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    if (sockets[socket.request.session.userid])
      sockets[socket.request.session.userid].push(socket.id);
    else
      sockets[socket.request.session.userid] = [socket.id];
    socket.on('new lobby', function(lobby) {
      socket.broadcast.emit('new lobby', lobby);
    });
    socket.on('join lobby', function(lobby) {
      if (socket.room){
        socket.leave(socket.room);
        socket.broadcast.emit('user left', socket.request.session.userid);
      }
      socket.join(lobby);
      socket.room = lobby;
      var user = {
        'id': socket.request.session.userid,
        'name': socket.request.session.name,
        'role': 0
      };
      io.to(lobby).emit('user joined', user);
    });
    socket.on('leave lobby', function() {
      if (socket.room){
        socket.leave(socket.room);
        socket.room = null;
        socket.broadcast.emit('user left', socket.request.session.userid);
      }
    });
    socket.on('lobby started', function() {
      io.to(socket.room).emit('lobby started');
    });
    socket.on('msg', function(msg) {
      io.emit('msg', socket.request.session.name + ": " + msg);
    });
    socket.on('user ready', function (userid) {
      io.to(socket.room).emit('user ready', userid);
    });
    socket.on('user unready', function (userid) {
      io.to(socket.room).emit('user unready', userid);
    });
    socket.on('disconnect', function() {
      if (socket.room) 
        Lobby.disconnect(socket.request.session.lobby, socket.request.session.userid);
      //remove socket.id from sockets map
      if (!sockets[socket.request.session.userid] || sockets[socket.request.session.userid].indexOf(socket.id) < 0)
        console.log(socket.id + "disconnected, but could not be found in the sockets to userid map");
      else{
        var index = sockets[socket.request.session.userid].indexOf(socket.id);
        sockets[socket.request.session.userid].splice(index, 1);
      }
    });
    console.log('a user connected');
  });
  return io;
};
