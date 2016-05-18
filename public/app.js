'use strict';

var app = angular.module('myApp', ['ui.bootstrap']);

angular.module('myApp')
  .controller('testController', function($scope, lobby) {
    var refreshLobbyList = function() {
      lobby.list().success(function(lobbies){ $scope.lobbies = lobbies;})
    };
    $scope.createGame = function(name){
      console.log(name);
      lobby.create(name);
      refreshLobbyList();
    };
    $scope.lobbies = [];
    refreshLobbyList();
  })
