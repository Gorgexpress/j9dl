export default class ChatCtrl {

  constructor(Socket) {
    this.messages = [];
    this.messages.push("Welcome to j9dl!");
    this.messages.push("Single clicke to view a lobby.");
    this.messages.push("Double click to join a lobby.");
    Socket.on('c:msg', function(msg) {
      if ($scope.messages.length > 10 )//may want to use a diff queue implementation
        $scope.messages.shift(); //that avoids shift
      $scope.messages.push(msg);
    });
  }

  sendMessage(msg){
    Socket.emit('c:msg',$scope.msgBox);
    this.msgBox = "";
  }
}
