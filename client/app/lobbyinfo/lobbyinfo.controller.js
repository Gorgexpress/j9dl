angular.module('myApp')
  .controller('LobbyInfoCtrl', function($scope, $timeout, LobbyInfo, Socket, Sound) {
    var refreshLobbyUserList = function(lobby) {
      if (lobby)
        LobbyInfo.get(lobby)
          .then(function(response){ 
            $scope.lobbyInfo = response.data;
            if ($scope.lobbyInfo.users[$scope.$parent.self.userid])
              $scope.showButtons = true;
            if ($scope.lobbyInfo.host === $scope.$parent.self.userid)
              $scope.isHost = true;
            if ($scope.lobbyInfo.users.length >= 4) {
              $scope.lobbyFull = true;
              Sound.play('gameIsFull');
            }
          }, function (response) {
            $scope.lobbyInfo.users = [];
            alert("Could not get lobby: " + response);
          });
    };

    //We will use this as a callback for a call to $timeout. We want
    //to temporarily disable the ready button so the client cant spam
    //it to ready and unready repeatedly 
    var reenableReadyButtonCallback = function () {
      $scope.disableReadyButton = false;
      timeoutPromise = null;
    };

    //when clicking ready button, ready or unready
    $scope.onReady = function() {
      if (!$scope.ready) {
        LobbyInfo.ready()
          .then(function (response) {
            Socket.emit('l:ready', $scope.$parent.self.userid);
            $scope.readyButtonText = "Unready";
            $scope.disableReadyButton = true;
            $scope.ready = true;
            $scope.lobbyInfo.readyCount++;
            //if everyone is ready, refresh lobby info as teams will be balanced.
            if (Object.keys($scope.lobbyInfo.users).length <= $scope.lobbyInfo.readyCount){
              $scope.$parent.self.inActiveLobby = true;
              refreshLobbyUserList($scope.$parent.lobby);
            }
            timeoutPromise = $timeout(reenableReadyButtonCallback, 3000);         
          }, function (response) {
            alert(response); 
          });
      }
      else {
        LobbyInfo.unready()
          .then(function (response) {
            Socket.emit('l:unready', $scope.$parent.self.userid);
            $scope.readyButtonText = "Ready";
            $scope.disableReadyButton = true;
            $scope.ready = false;
            $scope.lobbyInfo.readyCount--;
            timeoutPromise = $timeout(reenableReadyButtonCallback, 3000);
          }, function (response) {
            alert(response);
          });
      }
    };

    //vote for winner after a game is finished
    $scope.voteWinner = function(winner) {
      LobbyInfo.voteWinner(winner)
        .then(function (response) {
          $scope.votes[winner]++;
          if($scope.votes[winner] >= $scope.lobbyInfo.users.length / 2){
            $scope.$parent.self.inActiveLobby = false;
            refreshLobbyUserList();
          }

        }, function (response) {

        });
    };
    Socket.on('l:join', function(user) {
      $scope.lobbyInfo.users[user.id] = {
        'name': user.name,
        'role': user.role,
        'mu': user.mu
      };
      if(user.id === $scope.$parent.self.userid && $scope.lobbyInfo.users[user.id])
        $scope.showButtons = true;
      if (Object.keys($scope.lobbyInfo.users).length == 4){
        $scope.lobbyFull = true;
        Sound.play('gameIsFull');
      }
    });
    Socket.on('l:left', function(user) {
      if ($scope.lobbyInfo.users[user])
        delete $scope.lobbyInfo.users[user];
      if ($scope.lobbyFull) {
        //set state of controller to one where the lobby is not full
        //cancel our $timeout, as the callback is going to change the variable of
        //a button that is no longer accessible.
        $scope.lobbyFull = false;
        $scope.ready = false;
        $scope.disableReadyButton = false;
        if (timeoutPromise)
          $timeout.cancel(timeoutPromise);
      }
    });

    Socket.on('l:ready', function(userid) {
      $scope.lobbyInfo.users[userid].ready = true;
      $scope.lobbyInfo.readyCount++;
      //sync between different sockets on the same session
      if ($scope.$parent.self.userid === userid) {
        $scope.readyButtonText = "Unready";
        $scope.disableReadyButton = true;
        $scope.ready = true;
        timeoutPromise = $timeout(reenableReadyButtonCallback, 3000);   
      }
      //if everyone is ready, refresh lobby info as teams will be balanced.
      if (Object.keys($scope.lobbyInfo.users).length <= $scope.lobbyInfo.readyCount){
        $scope.$parent.self.inActiveLobby = true;
        refreshLobbyUserList($scope.$parent.lobby);
      }
    });
    Socket.on('l:unready', function(userid) {
      $scope.lobbyInfo.readyCount--;
      $scope.lobbyInfo.users[userid].ready = false;
      //sync between different sockets on the same session
      if ($scope.$parent.self.userid === userid) {
        $scope.readyButtonText = "Ready";
        $scope.disableReadyButton = true;
        $scope.ready = false;
        timeoutPromise = $timeout(reenableReadyButtonCallback, 3000);
      }
    });
    Socket.on('l:start', function() {
      refreshLobbyUserList($scope.$parent.lobby);
    });
    $scope.lobbyInfo = {
      'users': {}
    };
    $scope.showButtons = false;
    $scope.isHost = false;
    $scope.lobbyFull = false;
    $scope.ready = false;
    $scope.disableReadyButton = false;
    $scope.readyButtonText = "Ready";
    $scope.votes = {
      0: 0,
      1: 0
    };

    //holds the promose from our $timeout call so we can cancel it if necessary
    var timeoutPromise = null; 
    refreshLobbyUserList($scope.$parent.lobby);
    $scope.$on('$destroy', function (event) {
      Socket.removeAllListeners('l:joined');
      Socket.removeAllListeners('l:left');
      Socket.removeAllListeners('l:ready');
      Socket.removeAllListeners('l:unready');
      Socket.removeAllListeners('l:start');

    });

  });
