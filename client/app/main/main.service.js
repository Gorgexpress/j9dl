angular.module('myApp')
  .factory('MainService', function($http) {
    'use strict';
    return {
      getSelf: function() {
        return $http.get('api/user/self');
      }
    };
  });
