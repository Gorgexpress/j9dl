angular.module('myApp')
  .factory('LobbyInfo', function($http) {
    'use strict';
    return {
      get: function(lobby) {
        return $http.get('api/lobbies/get/' + lobby);
      },

      ready: function() {
        return $http.get('api/lobbies/ready');
      },

      unready: function() {
        return $http.get('api/lobbies/unready');
      },

      voteWinner: function(winner) {
        return $http.get('api/lobbies/voteWinner/' + winner);
      }
    };
  });
