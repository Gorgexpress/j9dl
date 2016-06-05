angular.module('myApp')
  .controller('MainCtrl', function($scope, Socket) {
    $scope.lobby = null;
    $scope.$on('$destroy', function (event) {
      Socket.removeAllListeners();
    });
    //getSelf();
  });
