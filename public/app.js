'use strict';

var app = angular.module('myApp', ['ui.bootstrap']);

angular.module('myApp')
  .controller('testController', function($scope, lobby, user, socket) {
    var refreshLobbyList = function() {
      lobby.list().success(function(lobbies){ $scope.lobbies = lobbies;})
    };
    var refreshUserList = function() {
      user.list().success(function(users) { $scope.users = users; })
    };
    var refreshLobbyUserList = function(lobbyName) {
      lobby.get(lobbyName).success(function(users){ $scope.lobbyUsers = users;})
    };
    $scope.createGame = function(name){
      lobby.create(name);
      refreshLobbyList();
      socket.emit('new lobby');
    };
    $scope.joinLobby = function(lobby) {
      socket.emit('join lobby', lobby);
      refreshLobbyUserList(lobby);
    };
    $scope.sendMessage = function(msg){
      socket.emit('message', socket.name + ": " + msg);
    };
    socket.on('new lobby', function () {
      refreshLobbyList();
    });
    socket.on('user joined', function() {
      console.log('user joined');
    });
    socket.on('message', function(msg) {
      $scope.messages.push(msg);
    });
    $scope.lobbies = [];
    $scope.lobbyUsers = {};
    $scope.messages = [];
    refreshLobbyList();
    refreshUserList();
    $scope.$on('$destroy', function (evcent) {
      socket.removeAllListeners();
    });
  })
