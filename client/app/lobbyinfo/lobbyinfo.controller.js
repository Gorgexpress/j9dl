angular.module('myApp')
  .controller('LobbyInfoCtrl', function($scope, LobbyInfo, Socket) {
    var refreshLobbyUserList = function(lobby) {
      if (lobby)
        LobbyInfo.get(lobby).success(function(users){ $scope.lobbyUsers = users;})
    };
    Socket.on('user joined', function() {
      refreshLobbyUserList($scope.lobby); 
    });
    Socket.on('user left', function() {
      refreshLobbyUserList($scope.lobby);
    });
    $scope.lobbyUsers = {};
    refreshLobbyUserList($scope.lobby);
    $scope.$on('$destroy', function (event) {
      Socket.removeAllListeners('user joined');
      Socket.removeAllListeners('user left');
    });

    //need to start modularing this code obviously
  });
