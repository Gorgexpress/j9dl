'use strict';

angular.module('myApp')
  .factory('lobby', function($http) {
    return {
      list: function() {
        return $http.get('api/lobbies/list');
      },
      create: function(name) {
        return $http.post('api/lobbies/create/' + name);
      }
    };
  });
