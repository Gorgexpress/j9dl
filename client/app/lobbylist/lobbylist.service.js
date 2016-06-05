'use strict';

angular.module('myApp')
  .factory('LobbyList', function($http) {
    return {
      listAll: function() {
        return $http.get('api/lobbies/list');
      },
      createLobby: function(name) {
        $http.post('api/lobbies/create/' + name);
      },
      joinLobby: function(lobby) {
        $http.get('api/lobbies/join/' + lobby);
      },
      leaveLobby: function() {
        $http.get('api/lobbies/leave');
      }
    };
  });
