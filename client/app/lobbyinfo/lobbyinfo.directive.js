angular.module('myApp')
  .directive('lobbyInfo', function() {
    return {
      templateUrl: 'app/lobbyinfo/lobbyinfo.html',
      controller: 'LobbyInfoCtrl',
      scope: {
        lobby: "="
      }
    };
  });
