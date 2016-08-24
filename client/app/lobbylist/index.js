import LobbyList from './lobbylist.service';
import LobbyListCtrl from './lobbylist.controller';
import lobbyList from './lobbylist.directive';
require('./lobbylist.css');
var app = require('angular').module('myApp');

app.service('LobbyList', LobbyList)
  .controller('LobbyListCtrl', LobbyListCtrl)
  .directive('lobbyList', lobbyList);
