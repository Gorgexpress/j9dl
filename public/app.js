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
    var refreshLobbyUserList = function(room) {
      lobby.listByLobby(room).success(function(users){ $scope.lobbyUsers = users;})
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
    socket.on('new lobby', function () {
      refreshLobbyList();
    });
    socket.on('user joined', function() {
      console.log('user joined');
    });
    $scope.lobbies = [];
    refreshLobbyList();
    refreshUserList();
  })
