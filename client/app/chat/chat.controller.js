angular.module('myApp')
  .controller('ChatCtrl', function($scope, Socket) {
    /*var getSelf = function() {
      User.self().success(function(self) { $scope.self = self;})
    };*/

$scope.sendMessage = function(msg){
  Socket.emit('msg',msg);
};
Socket.on('msg', function(msg) {
    if ($scope.messages.length > 5 )//may want to use a diff queue implementation
    $scope.messages.shift(); //that avoids shift
    $scope.messages.push(msg);
    });
$scope.messages = [];
//getSelf();
});
