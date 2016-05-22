
angular.module("myApp")
  .factory('socket', function ($rootScope) {
    var socket = io();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          console.log("in on");
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit : function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          console.log("in emit");
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      removeAllListeners: function (eventName, callback) {
        socket.removeAllListeners(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }
    };
  });
