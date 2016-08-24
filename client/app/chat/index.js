import ChatCtrl from './chat.controller';
import chat from './chat.directive';
require('./chat.css');
var app = require('angular').module('myApp');

app.controller('ChatCtrl', ChatCtrl)
  .directive('chat', chat);
