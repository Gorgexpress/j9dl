export default class LobbyListCtrl {

  constructor($scope, LobbyList, Socket) {
    this.LobbyList = LobbyList;
    this.Socket = Socket;
    this.$scope = $scope;
    this.lobbies = {};
    this.lobbyButtonText = "Create Lobby";
    this.inLobby = false;
    this.newLobbyName = "";
    //grab user session info such as name, id, and lobby the client is currently in.
    this.refreshLobbyList.apply(this);
    this.initSockets.call(this);
    this.activeBtn = this.$scope.mainctrl.self.lobby;
    if (this.lobbies[this.activeBtn])
      this.lobbyButtonText = "Lave Lobby";
  }
  init(controller, unregister) {
    controller.activeBtn = controller.$scope.mainctrl.$self.lobby;
    unregister();
    controller.refreshLobbyList();
    controller.initSockets(controller.Socket);
    if (controller.lobbies[controller.activeBtn]);
      controller.lobbyButtonText = "Leave Lobby";

  }
  refreshLobbyList() {
    this.LobbyList.listAll().then( response => { 
      this.lobbies = response.data;
    }, function (response) {
      alert("Could not get list of lobbies: " + response.message);
    });
  }

  createGame(name){
    if (!this.inLobby) {
      this.newLobbyName = "";
      this.LobbyList.createLobby(name).then( response => {
        this.lobbies[name] = 1;
        this.Socket.emit('l:new', name);
        this.Socket.emit('l:join', name);
        this.lobbyButtonText = "Leave Lobby";
        this.inLobby = true;
        this.activeBtn = name;
        this.$scope.mainctrl.lobby = name;

      }, function (response) {
        if (response.status == 409)
          alert("That lobby name already exists!");
        else
          alert("Could not create lobby: " + response.message);
      });
    } 
    else {
      //code to leave lobby 
      this.LobbyList.leaveLobby();
      this.Socket.emit('l:left', name);
      this.lobbyButtonText = "Create Lobby";
      this.inLobby = false;
      this.activeBtn = "";
      this.$scope.mainctrl.lobby = null;
    }
  }
  joinLobby(lobby) {
    if(!this.inLobby) {
      this.LobbyList.joinLobby(lobby).then( response => {
        this.inLobby = true;
        this.lobbyButtonText = "Leave Lobby";
        this.Socket.emit('l:join', lobby);
        this.activeBtn = lobby;
        this.$scope.mainctrl.lobby = lobby;
      }, function (response) {
        alert("Could not join lobby: " + response.message);
      });
    }
  }
  viewLobby(lobby) {
    if(this.$scope.mainctrl.lobby !== lobby){
      this.$scope.mainctrl.lobby = lobby;
    }
  }
  initSockets() {
    this.Socket.on('l:new', lobby => {
      this.lobbies[lobby] = 0;
    });
    this.Socket.on('l:disband', (lobby, v2) => {
      delete this.lobbies[lobby];
      //if currently viewed lobby was disbanded, set that value to null
      if (this.$scope.mainctrl.lobby == lobby)
        this.$scope.mainctrl.lobby = null;
      //same for lobby the client is currently in
      if (this.activeBtn == lobby) {
        this.lobbyButtonText = "Create Lobby";
        this.inLobby = false;
        this.activeBtn = "";
        this.self.inActiveLobby = false;
      }
    });
    this.Socket.on('l:incCount', lobby => {
      if (typeof(this.lobbies[lobby] !== 'undefined'))
        this.lobbies[lobby]++;
    });
    this.Socket.on('l:decCount', lobby => {
      if (this.lobbies[lobby])
        this.lobbies[lobby]--;
    });
    //sync join, emitted only to tabs that share the same session
    this.Socket.on('l:sjoin', lobby => {
      this.inLobby = true;
      this.lobbyButtonText = "Leave Lobby";
      this.activeBtn = lobby;
      this.$scope.mainctrl.lobby = lobby;
    });
    //sync leave
    this.Socket.on('l:sleave', lobby => {
      this.inLobby = false;
      this.lobbyButtonText = "Create Lobby";
      this.activeBtn = "";
      this.$scope.mainctrl.lobby = null;
    });
  }
}
