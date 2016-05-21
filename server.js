var express = require('express');
var http = require('http');
var path = require('path');
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();
var bodyParser = require('body-parser');

var app = express();
var server = http.Server(app);
var port = process.env.PORT || 3000;
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
    console.log(socket.rooms)
  });
  console.log('a user connected');
});

app.use(session({
  secret: 'ergvergerg',
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



var controllers = require('./app/controllers/lobby');
app.set('view engine', 'html');
require('./app/routes.js')(app, controllers);
app.use(express.static(path.join(__dirname, 'public')));
server.listen(port, function() {
  console.log('listening on 3000');
});

module.exports = app;
