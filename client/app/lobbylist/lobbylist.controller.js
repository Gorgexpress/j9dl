angular.module('myApp')
  .controller('LobbyListCtrl', function($scope, LobbyList, Socket) {
    'use strict';
    var refreshLobbyList = function() {
      LobbyList.listAll().then(function (response) { 
        $scope.lobbies = response.data;
      }, function (response) {
        alert("Could not get list of lobbies: " + response);
      });
    };
    $scope.createGame = function(name){
      if (!$scope.inLobby) {
        LobbyList.createLobby(name).then( function (response) {
          $scope.lobbies.push(name);
          Socket.emit('new lobby', name);
          Socket.emit('join lobby', name);
          $scope.lobbyButtonText = "Leave Lobby";
          $scope.inLobby = true;
          $scope.activeBtn = $scope.lobbies.indexOf(name);
          $scope.lobby = name;

        }, function (response) {
          if (response.status == 409)
            alert("That lobby name already exists!");
          else
            alert("Could not create lobby: " + error);
        });
      } 
      else {
        //code to leave lobby 
        LobbyList.leaveLobby();
        Socket.emit('leave lobby', name);
        $scope.lobbyButtonText = "Create Lobby";
        $scope.inLobby = false;
        $scope.activeBtn = -1;
        $scope.lobby = null;
      }
    };
    $scope.joinLobby = function(lobby, index) {
      if(!$scope.inLobby) {
        LobbyList.joinLobby(lobby).then(function (response) {
          $scope.inLobby = true;
          $scope.lobbyButtonText = "Leave Lobby";
          Socket.emit('join lobby', lobby);
          $scope.activeBtn = index;
          $scope.lobby = lobby;
        }, function (response) {
          alert("Could not join lobby: " + response);
        });
      }
    };
    $scope.viewLobby = function(lobby, index) {
      if($scope.lobby !== lobby){
        $scope.lobby = lobby;
      }
    };
    Socket.on('new lobby', function (lobby) {
      $scope.lobbies.push(lobby);
    });
    Socket.on('lobby ended', function(lobby) {
      var index = $scope.lobbies.indexOf(lobby);
      $scope.lobbies.splice(index, 1);
    });

    $scope.lobbies = [];
    $scope.lobbyButtonText = "Create Lobby";
    $scope.inLobby = false;
    refreshLobbyList();
      /*$scope.$on('$destroy', function (event) {
    Socket.removeAllListeners();
    });*/
    //need to start modularing this code obviously
  });
