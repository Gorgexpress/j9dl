'use strict';

var app = angular.module('myApp', ['ui.bootstrap']);

angular.module('myApp').controller('testController', function($scope, Lobby, User, Socket) {
  var refreshLobbyList = function() {
    Lobby.list().success(function(lobbies){ $scope.lobbies = lobbies;})
  };
  var refreshUserList = function() {
    User.list().success(function(users) { $scope.users = users; })
  };
  var refreshLobbyUserList = function(lobbyName) {
    Lobby.get(lobbyName).success(function(users){ $scope.lobbyUsers = users;})
  };
  $scope.createGame = function(name){
    if (!inLobby) {
      Lobby.create(name);
      refreshLobbyList();
      Socket.emit('new lobby');
      Socket.emit('join lobby', name);
      $scope.lobbyButtonText = "Leave Lobby";
      inLobby = true;
      refreshLobbyUserList(name);
    }
    else {
      //code to leave lobby 
      Lobby.leave();
      Socket.emit('leave lobby', name);
      $scope.lobbyButtonText = "Create Lobby";
      inLobby = false;
      $scope.lobbyUsers = {};
    }
  };
  $scope.joinLobby = function(lobby) {
    if(!inLobby) {
      inLobby = true;
      $scope.lobbyButtonText = "Leave Lobby";
      Lobby.join(lobby);
      Socket.emit('join lobby', lobby);
      refreshLobbyUserList(lobby);
    }
  };
  $scope.sendMessage = function(msg){
    Socket.emit('message', socket.name + ": " + msg);
  };
  Socket.on('new lobby', function () {
    refreshLobbyList();
  });
  Socket.on('user joined', function() {
    refreshLobbyList(); 
  });
  Socket.on('user left', function() {
    refreshLobbyList();
  });
  Socket.on('message', function(msg) {
    $scope.messages.push(msg);
  });
  $scope.lobbies = [];
  $scope.lobbyUsers = {};
  $scope.messages = [];
  $scope.lobbyButtonText = "Create Lobby";
  var inLobby = false;
  refreshLobbyList();
  refreshUserList();
  $scope.$on('$destroy', function (event) {
    Socket.removeAllListeners();
  });
})
