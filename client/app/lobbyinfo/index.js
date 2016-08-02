import LobbyInfo from './lobbyinfo.service';
import LobbyInfoCtrl from './lobbyinfo.controller';
import lobbyInfo from './lobbyinfo.directive';
var app = require('angular').module('myApp');

app.service('LobbyInfo', LobbyInfo)
  .controller('LobbyInfoCtrl', LobbyInfoCtrl)
  .directive('lobbyInfo', lobbyInfo);
