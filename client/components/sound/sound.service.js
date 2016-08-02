export default class Sound {
  constructor() {
    this.sounds = {
      'gameIsFull': new Audio('/sounds/gameIsFull.wav')
    };
  }
  play(soundName) {
    this.sounds[soundName].play();
  }
}
