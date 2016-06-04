var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var port = process.env.PORT || 3000;

var io = require('./config/socket.io.js')(server);
require('./config/express')(app);

var controllers = require('./api/lobby.controller');
controllers.init(io);
require('./routes.js')(app, controllers);
app.use(express.static(path.join(__dirname, '../client')));
server.listen(port, function() {
  console.log('listening on 3000');
});

module.exports = app;
