var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var port = process.env.PORT || 3000;
var controllers = require('./app/controllers/lobbies');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
console.log(controllers);
require('./app/routes.js')(app, controllers);
server.listen(port, function() {
  console.log('listening on 3000');
});

module.exports = app;
