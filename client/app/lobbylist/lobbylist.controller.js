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
        $scope.newLobbyName = "";
        LobbyList.createLobby(name).then( function (response) {
          $scope.lobbies[name] = 0;
          Socket.emit('l:new', name);
          Socket.emit('l:join', name);
          $scope.lobbyButtonText = "Leave Lobby";
          $scope.inLobby = true;
          $scope.activeBtn = name;
          $scope.$parent.lobby = name;

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
        Socket.emit('l:left', name);
        $scope.lobbyButtonText = "Create Lobby";
        $scope.inLobby = false;
        $scope.activeBtn = "";
        $scope.$parent.lobby = null;
      }
    };
    $scope.joinLobby = function(lobby) {
      if(!$scope.inLobby) {
        LobbyList.joinLobby(lobby).then(function (response) {
          $scope.inLobby = true;
          $scope.lobbyButtonText = "Leave Lobby";
          Socket.emit('l:join', lobby);
          $scope.activeBtn = lobby;
          $scope.$parent.lobby = lobby;
        }, function (response) {
          alert("Could not join lobby: " + response);
        });
      }
    };
    $scope.viewLobby = function(lobby) {
      if($scope.$parent.lobby !== lobby){
        $scope.$parent.lobby = lobby;
      }
    };
    Socket.on('l:new', function (lobby) {
      $scope.lobbies[lobby] = 1;
    });
    Socket.on('l:disband', function(lobby) {
      delete $scope.lobbies[lobby];
      //if currently viewed lobby was disbanded, set that value to null
      if ($scope.$parent.lobby == lobby)
        $scope.$parent.lobby = null;
      //same for lobby the client is currently in
      if ($scope.activeBtn === lobby) {
        $scope.lobbyButtonText = "Create Lobby";
        $scope.inLobby = false;
        $scope.activeBtn = "";
      }
    });
    Socket.on('l:incCount', function (lobby) {
      if ($scope.lobbies[lobby])
        $scope.lobbies[lobby]++;
    });
    Socket.on('l:decCount', function (lobby) {
      if ($scope.lobbies[lobby])
        $scope.lobbies[lobby]--;
    });
    //sync join, emitted only to tabs that share the same session
    Socket.on('l:sjoin', function(lobby) {
      $scope.inLobby = true;
      $scope.lobbyButtonText = "Leave Lobby";
      $scope.activeBtn = lobby;
      $scope.$parent.lobby = lobby;
    });
    //sync leave
    Socket.on('l:sleave', function(lobby) {
      $scope.inLobby = false;
      $scope.lobbyButtonText = "Create Lobby";
      $scope.activeBtn = "";
      $scope.$parent.lobby = null;
    });
    $scope.lobbies = [];
    $scope.lobbyButtonText = "Create Lobby";
    $scope.inLobby = false;
    $scope.newLobbyName = "";
    //grab user session info such as name, id, and lobby the client is currently in.
    var unregister = $scope.$watch('$parent.self', function () {
      if ($scope.lobbies[$scope.$parent.self.lobby])
        $scope.activeBtn = $scope.$parent.self.lobby;
      else //lobby doesn't exist, set it to null
        $scope.$parent.self.lobby = null;
      unregister(); //we only need this watcher to know when the variable is initialized
    });
    refreshLobbyList();
      /*$scope.$on('$destroy', function (event) {
    Socket.removeAllListeners();
    });*/
  });
