import Socket from './socketio/socket.io';
import Sound from './sound/sound.service';
var app = require('angular').module('myApp');

app.service('Socket', Socket)
  .service('Sound', Sound);
