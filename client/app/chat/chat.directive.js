angular.module('myApp')
  .directive('chat', function() {
    return {
      templateUrl: 'app/chat/chat.html',
      controller: 'ChatCtrl'
    };
  });
