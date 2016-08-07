import ChatCtrl from './chat.controller';
import chat from './chat.directive';

var app = require('angular').module('myApp');

app.controller('ChatCtrl', ChatCtrl)
  .directive('chat', chat);
