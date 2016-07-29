angular.module('myApp')
  .controller('ChatCtrl', function($scope, Socket) {

$scope.sendMessage = function(msg){
  Socket.emit('c:msg',$scope.msgBox);
  $scope.msgBox = "";
};
Socket.on('c:msg', function(msg) {
    if ($scope.messages.length > 10 )//may want to use a diff queue implementation
    $scope.messages.shift(); //that avoids shift
    $scope.messages.push(msg);
    });
$scope.messages = [];
$scope.messages.push("Welcome to j9dl!");
$scope.messages.push("Single click to view a lobby.");
$scope.messages.push("Double click to join a lobby.");

});
