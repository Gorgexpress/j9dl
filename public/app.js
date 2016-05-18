'use strict';

var app = angular.module('myApp', ['ui.bootstrap']);

angular.module('myApp')
  .controller('testController', function($scope, lobby, socket) {
    var refreshLobbyList = function() {
      lobby.list().success(function(lobbies){ $scope.lobbies = lobbies;})
    };
    $scope.createGame = function(name){
      lobby.create(name);
      refreshLobbyList();
      socket.emit('new lobby');
    };
    socket.on('new lobby', function () {
      console.log("HELLO");
      refreshLobbyList();
    });
    $scope.lobbies = [];
    refreshLobbyList();
  })
