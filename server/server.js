var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var app = express();
var server = http.Server(app);
var port = process.env.PORT || 3000;
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/test';
var io = require('./config/socket.io.js')(server);
var middleware = require('./config/express')(app);

io.use(function(socket, next) {
  middleware(socket.request, socket.request.res, next);
});

mongoose.connect(mongoURI);
var controllers = require('./api/lobby/lobby.controller');
require('./routes.js')(app);
app.use(express.static(path.join(__dirname, '../client')));
server.listen(port, function() {
  console.log('listening on 3000');
});

module.exports = app;
