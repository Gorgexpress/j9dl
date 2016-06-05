angular.module('myApp')
  .controller('MainCtrl', function($scope, Socket) {
    $scope.$on('$destroy', function (event) {
      Socket.removeAllListeners();
    });
    //getSelf();
  });
