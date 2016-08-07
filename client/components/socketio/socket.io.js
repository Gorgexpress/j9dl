import io from 'socket.io-client';
export default class Socket {
  constructor($timeout) {
    this.$timeout= $timeout;
    this.socket = io();
  }
  on(eventName, callback) {
    this.socket.on(eventName, (...args) => {
      this.$timeout( () => {
        callback(...args);
      });
    });
  }
  emit(eventName, data, callback) {
    this.socket.emit(eventName, data, (...args) => {
      this.$timeout( () => {
        if (callback) {
          callback(...args);
        }
      });
    });
  }
  removeAllListeners(eventName, callback) {
    this.socket.removeAllListeners(eventName);
  }
}
