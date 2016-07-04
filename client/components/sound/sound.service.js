
angular.module("myApp").factory('Sound', function ($rootScope) {
  var sounds = {
    'gameIsFull': new Audio('/sounds/gameIsFull.wav'),
  };
  return {
    play: function(soundName) {
      console.log('playing sound');
      sounds[soundName].play();
    }
  };
});
