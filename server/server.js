import express from 'express';
import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
var app = express();
var server = http.Server(app);
var port = process.env.PORT || 3000;
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/test';
var io = require('./config/socket.io.js').default(server);
var middleware = require('./config/express').default(app);

io.use(function(socket, next) {
  middleware(socket.request, socket.request.res, next);
});
mongoose.connect(mongoURI);
require('./routes.js').default(app);
app.use(express.static(path.join(__dirname, '../client')));
server.listen(port, function() {
  console.log('listening on 3000');
});

module.exports = app;
