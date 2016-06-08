angular.module('myApp')
  .factory('LobbyInfo', function($http) {
    'use strict';
    return {
      get: function(lobby) {
        return $http.get('api/lobbies/get/' + lobby);
      }
    };
  });
