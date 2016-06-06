angular.module('myApp')
  .controller('LobbyListCtrl', function($scope, LobbyList, Socket) {
    var refreshLobbyList = function() {
      LobbyList.listAll().success(function(lobbies){ $scope.lobbies = lobbies;})
    };
    $scope.createGame = function(name){
      if (!$scope.inLobby) {
        LobbyList.createLobby(name);
        Socket.emit('new lobby', name);
        Socket.emit('join lobby', name);
        $scope.lobbyButtonText = "Leave Lobby";
        $scope.inLobby = true;
        $scope.activeBtn = $scope.lobbies.indexOf(name);
        $scope.lobby = name;
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
        $scope.inLobby = true;
        $scope.lobbyButtonText = "Leave Lobby";
        LobbyList.joinLobby(lobby);
        Socket.emit('join lobby', lobby);
        $scope.activeBtn = index;
        $scope.lobby = lobby;
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
