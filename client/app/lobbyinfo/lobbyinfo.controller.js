angular.module('myApp')
  .controller('LobbyInfoCtrl', function($scope, LobbyInfo, Socket) {
    //TODO switch structure of lobbyUsers to array of objects with name, id, role, etc.. attributes
    var refreshLobbyUserList = function(lobby) {
      if (lobby)
        LobbyInfo.get(lobby)
          .then(function(response){ 
            $scope.lobbyInfo = response.data;
            if ($scope.lobbyInfo.users[$scope.$parent.self.name])
              $scope.showButtons = true;
            if ($scope.lobbyInfo.host === $scope.$parent.self.userid)
              $scope.isHost = true;
          }, function (response) {
            $scope.lobbyInfo.users = [];
            alert("Could not get lobby: " + response);
          });
    };
    Socket.on('user joined', function(user) {
      $scope.lobbyInfo.users[user.id] = {
        'name': user.name,
        'role': user.role
      };
      if(user.id === $scope.$parent.self.userid && $scope.lobbyInfo.users[user.id])
        $scope.showButtons = true;
    });
    Socket.on('user left', function(user) {
      if ($scopy.lobbyInfo.users[user])
        delete $scope.lobbyInfo.users[user];
    });
    $scope.lobbyInfo = {
      'users': {}
    };
    $scope.showButtons = false;
    $scope.isHost = false;
    refreshLobbyUserList($scope.$parent.lobby);
    $scope.$on('$destroy', function (event) {
      Socket.removeAllListeners('user joined');
      Socket.removeAllListeners('user left');
    });
  
  });
