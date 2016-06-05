angular.module('myApp')
  .directive('lobbyList', function() {
    return {
      templateUrl: 'app/lobbylist/lobbylist.html',
      controller: 'LobbyListCtrl'
    };
  });
