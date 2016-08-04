export default class MainCtrl { 
  constructor($scope, $timeout, Socket, Main) {
    this.$scope = $scope;
    this.Socket = Socket;
    this.Main = Main;
    this.lobby = "";
    this.self = {
      lobby: ''
    };
    $scope.$on('$destroy',event => Socket.removeAllListeners());
    Main.getSelf().then( response => {
      this.self = response.data;
    }, response => {
      alert("Could not get user information: " + response);
    });
  }
}

