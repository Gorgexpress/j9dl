module.exports = function(io, socket) {
  socket.on('c:msg', function (msg) {
    io.emit('c:msg', socket.request.session.name + ": " + msg);
  });
};
