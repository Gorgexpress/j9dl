angular.module('myApp')
  .factory('user', function($http) {
    return {
      list: function() {
        return $http.get('api/user/list');
      }
    };
  });
