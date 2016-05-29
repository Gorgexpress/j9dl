'use strict';

angular.module('myApp')
  .factory('Lobby', function($http) {
    return {
      list: function() {
        return $http.get('api/lobbies/list');
      },
      create: function(name) {
        return $http.post('api/lobbies/create/' + name);
      },
      get: function(lobby) {
        return $http.get('api/lobbies/get/' + lobby);
      },
      join: function(lobby) {
        return $http.get('api/lobbies/join/' + lobby);
      },
      leave: function() {
        return $http.get('api/lobbies/leave');
      }
    };
  });
