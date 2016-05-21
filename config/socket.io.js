module.exports = function(server){
var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('new lobby', function() {
    io.emit('new lobby');
  });
  socket.on('join lobby', function(lobby) {
    if (socket.room)
      socket.leave(socket.room);
    socket.join(lobby);
    socket.room = lobby;
    io.to(lobby).emit('user joined');
  });
  console.log('a user connected');
});
return io;
};
