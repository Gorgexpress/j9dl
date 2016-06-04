angular.module('myApp')
  .factory('User', function($http) {
    return {
      list: function() {
        return $http.get('api/user/list');
      },
      self: function() {
        return $http.get('api/user/self');
      }
    };
  });
