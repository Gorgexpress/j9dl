var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('new lobby', function() {
    io.emit('new lobby');
  });
  console.log('a user connected');
});

var controllers = require('./app/controllers/lobby');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
require('./app/routes.js')(app, controllers);
server.listen(port, function() {
  console.log('listening on 3000');
});

module.exports = app;
