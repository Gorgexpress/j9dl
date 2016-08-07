export default class ChatCtrl {

  constructor(Socket) {
    this.Socket = Socket;
    this.messages = [];
    this.messages.push("Welcome to j9dl!");
    this.messages.push("Single click to view a lobby.");
    this.messages.push("Double click to join a lobby.");
    Socket.on('c:msg', msg => {
      if (this.messages.length > 10 )//may want to use a diff queue implementation
        this.messages.shift(); //that avoids shift
      this.messages.push(msg);
    });
  }

  sendMessage(msg){
    this.Socket.emit('c:msg',this.msgBox);
    this.msgBox = "";
  }
}
