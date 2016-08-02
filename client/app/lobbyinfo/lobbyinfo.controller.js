export default class LobbyInfoCtrl {
  constructor($scope, $timeout, LobbyInfo, Socket, Sound) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.LobbyInfo = LobbyInfo;
    this.Socket = Socket;
    this.Sound = Sound;
    this.showButtons = false;
    this.isHost = false;
    this.lobbyFull = false;
    this.ready = false;
    this.disableReadyButton = false;
    this.readyButtonText = "Ready";
    this.votes = {
      0: 0,
      1: 0
    };
    this.lobbyInfo = {
      'users': {}
    };
    //holds the promose from our $timeout call so we can cancel it if necessary
    this.timeoutPromise = null; 
    this.refreshLobbyUserList.call(this, $scope.mainctrl.lobby);
    //destroy promises and listeners to stop memory leaks
    $scope.$on('$destroy', event => {
      Socket.removeAllListeners('l:join');
      Socket.removeAllListeners('l:left');
      Socket.removeAllListeners('l:ready');
      Socket.removeAllListeners('l:unready');
      Socket.removeAllListeners('l:start');
      Socket.removeAllListeners('l:enableVote');
      if (timeoutPromise)
        this.$timeout.cancel(this.timeoutPromise);
    });
  }

  refreshLobbyUserList(lobby) {
    if (lobby)
      LobbyInfo.get(lobby)
        .then( response => { 
          this.lobbyInfo = response.data;
          if (this.lobbyInfo.users[this.$scope.mainctrl.self.userid])
            this.showButtons = true;
          if (this.lobbyInfo.host === this.$scope.mainctrl.self.userid)
            this.isHost = true;
          if (this.lobbyInfo.users.length >= this.$scope.mainctrl.self.lobbySize) {
            this.lobbyFull = true;
            Sound.play('gameIsFull');
          }
        }, function (response) {
          this.lobbyInfo.users = [];
          alert("Could not get lobby: " + response);
        });
  }

  //We will use this as a callback for a call to $timeout. We want
  //to temporarily disable the ready button so the client cant spam
  //it to ready and unready repeatedly 
  reenableReadyButtonCallback() {
    this.disableReadyButton = false;
    timeoutPromise = null;
  }

  //when clicking ready button, ready or unready
  onReady() {
    if (!this.ready) {
      LobbyInfo.ready()
        .then(function (response) {
          Socket.emit('l:ready', this.$scope.mainctrl.self.userid);
          this.readyButtonText = "Unready";
          this.disableReadyButton = true;
          this.ready = true;
          this.lobbyInfo.readyCount++;
          //if everyone is ready, refresh lobby info as teams will be balanced.
          if (Object.keys(this.lobbyInfo.users).length <= this.lobbyInfo.readyCount){
            this.$scope.mainctrl.self.inActiveLobby = true;
            refreshLobbyUserList(this.$scope.mainctrl.lobby);
          }
          timeoutPromise = this.$timeout(reenableReadyButtonCallback, 3000);         
        }, function (response) {
          alert(response); 
        });
    }
    else {
      LobbyInfo.unready()
        .then(function (response) {
          Socket.emit('l:unready', this.$scope.mainctrl.self.userid);
          this.readyButtonText = "Ready";
          this.disableReadyButton = true;
          this.ready = false;
          this.lobbyInfo.readyCount--;
          timeoutPromise = this.$timeout(reenableReadyButtonCallback, 3000);
        }, function (response) {
          alert(response);
        });
    }
  }

  //vote for winner after a game is finished
  voteWinner(winner) {
    LobbyInfo.voteWinner(winner)
      .then( response => {
        this.votes[winner]++;
        if(this.votes[winner] >= this.lobbyInfo.users.length / 2){
          this.$scope.mainctrl.self.inActiveLobby = false;
          refreshLobbyUserList();
        }

      }, function (response) {

      });
  }
  initSockets(Socket) {
    Socket.on('l:join', function(user) {
      this.lobbyInfo.users[user.id] = {
        'name': user.name,
        'role': user.role,
        'mu': user.mu
      };
      if(user.id === this.$scope.mainctrl.self.userid && this.lobbyInfo.users[user.id])
        this.showButtons = true;
      if (Object.keys(this.lobbyInfo.users).length === this.$scope.mainctrl.self.lobbySize){
        this.lobbyFull = true;
        Sound.play('gameIsFull');
      }
    });
    Socket.on('l:left', function(user) {
      if (this.lobbyInfo.users[user])
        delete this.lobbyInfo.users[user];
      if (this.lobbyFull) {
        //set state of controller to one where the lobby is not full
        //cancel our $timeout, as the callback is going to change the variable of
        //a button that is no longer accessible.
        this.lobbyFull = false;
        this.ready = false;
        this.disableReadyButton = false;
        if (timeoutPromise)
          this.$timeout.cancel(timeoutPromise);
      }
    });

    Socket.on('l:ready', function(userid) {
      this.lobbyInfo.users[userid].ready = true;
      this.lobbyInfo.readyCount++;
      //sync between different sockets on the same session
      if (this.$scope.mainctrl.self.userid === userid) {
        this.readyButtonText = "Unready";
        this.disableReadyButton = true;
        this.ready = true;
        this.timeoutPromise = this.$timeout(reenableReadyButtonCallback, 3000);   
      }
      //if everyone is ready, refresh lobby info as teams will be balanced.
      if (Object.keys(this.lobbyInfo.users).length <= this.lobbyInfo.readyCount){
        this.$scope.mainctrl.self.inActiveLobby = true;
        refreshLobbyUserList(this.$scope.mainctrl.lobby);
      }
    });
    Socket.on('l:unready', function(userid) {
      this.lobbyInfo.readyCount--;
      this.lobbyInfo.users[userid].ready = false;
      //sync between different sockets on the same session
      if (this.$scope.mainctrl.self.userid === userid) {
        this.readyButtonText = "Ready";
        this.disableReadyButton = true;
        this.ready = false;
        this.timeoutPromise = this.$timeout(reenableReadyButtonCallback, 3000);
      }
    });
    Socket.on('l:start', function() {
      refreshLobbyUserList(this.$scope.mainctrl.lobby);
    });
    Socket.on('l:enableVote', (lobby) => {
      if (this.$scope.mainctrl.lobby == lobby)
        this.lobbyInfo.canVote = true;
    });
  }
}
