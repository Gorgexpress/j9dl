angular.module('myApp')
  .factory('LobbyList', function($http) {
    'use strict';
    return {
      listAll: function() {
        return $http.get('api/lobbies/list');
      },
      createLobby: function(name) {
        return $http.post('api/lobbies/create/' + name);
      },
      joinLobby: function(lobby) {
        return $http.get('api/lobbies/join/' + lobby);
      },
      leaveLobby: function() {
        return $http.get('api/lobbies/leave');
      }
    };
  });
