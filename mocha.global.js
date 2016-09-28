var app = require('./dist/server.js');
var mongoose = require('mongoose');

after(function(done) {
  app.angularFullstack.on('close', function() {done();});
  mongoose.connection.close();
  app.angularFullstack.close();
});
