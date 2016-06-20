var Lobby = require('../api/lobby/lobby.controller.js');
var sockets = {}; //maps session.userid to socket.id

var onConnect = function (io, socket) {
  require('../api/chat/chat.socket')(io, socket);
  require('../api/lobby/lobby.socket')(io, socket);
};

module.exports = function(server){
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    //all sockets from the same session will join a room named after their userid
    socket.join('u:' + socket.request.session.userid); 
    if (sockets[socket.request.session.userid])
      sockets[socket.request.session.userid].push(socket.id);
    else
      sockets[socket.request.session.userid] = [socket.id];
    socket.on('new lobby', function(lobby) {
      socket.broadcast.emit('new lobby', lobby);
    });
    onConnect(io, socket);
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
