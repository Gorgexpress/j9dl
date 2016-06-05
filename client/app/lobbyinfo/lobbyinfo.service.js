'use strict';

angular.module('myApp')
  .factory('LobbyInfo', function($http) {
    return {
      get: function(lobby) {
        return $http.get('api/lobbies/get/' + lobby);
      }
    };
  });
