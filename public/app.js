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
    $scope.createGame = function(name){
      lobby.create(name);
      refreshLobbyList();
      socket.emit('new lobby');
    };
    socket.on('new lobby', function () {
      refreshLobbyList();
    });
    $scope.lobbies = [];
    refreshLobbyList();
    refreshUserList();
  })
