angular.module('myApp')
  .controller('MainCtrl', function($scope, Socket, MainService) {
    var getSelf = function () {
      MainService.getSelf().then(function (response) {
        $scope.self = response.data;
      }, function(response) {
        alert("Could not get user information: " + response);
      });
    };
    $scope.lobby = null;
    $scope.$on('$destroy', function (event) {
      Socket.removeAllListeners();
    });
    $scope.self = {};
    getSelf();
  });
