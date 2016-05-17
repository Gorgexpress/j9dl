'use strict';

var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('testController', ['$scope', '$http', function($scope, $http) {;
  $http.get('api/lobbies/list').then(function(response) {
    $scope.arr = response.data;
  }, function() {
    $scope.arr = ["Failed"];
  });
}]);
