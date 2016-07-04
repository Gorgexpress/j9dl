var OnlineUser = require('../user/user.controller.js');
var Rating = require('../rating/rating.model.js');
var RatingCtrl = require('../rating/rating.controller.js');
var PythonShell = require('python-shell');
var LobbyEvents = require('./lobby.events');
var _ = require('lodash');
//TODO 95% of the controller logic ended up here.. should structure the api a different way.

lobbies = {
  '-APEM pros only': {
    'players': [20],
    'forbid': [1000],
    'host': [20],
    'inProgress': false,
    'canVote': false,
    'ready': []
  },
  'ARDM': {
    'players': [25, 26, 27],
    'forbid': [2000],
    'host': [25],
    'inProgress': false,
    'canVote': false,
    'ready': [25, 26, 27]
  }
};

//var lobbies= {};
module.exports = {
  list: function(req, res, next) {
    var list = {};
    _.each(Object.keys(lobbies), function (name) {
      list[name] = lobbies[name].players.length;
    });
    res.status(200).json(list);
  },

  create: function(req, res, next) {
    if (lobbies[req.params.name])
      res.status(409).send({});
    else{
      lobbies[req.params.name] = {
      'players': [req.session.userid],
      'forbid': [],
      'host': req.session.userid,
      'inProgress': false,
      'canVote': false,
      'ready': []
    };
    req.session.lobby = req.params.name;
    res.send({});
    }
  },

  get: function(req, res, next) {
    var playerIds = lobbies[req.params.lobby].players;
    var lobbyObject = {
      'host': lobbies[req.params.lobby].host,
      'users': {},
      'readyCount': lobbies[req.params.lobby].ready.length,
      'inProgress': lobbies[req.params.lobby].inProgress,
      'order': playerIds //ordered array of ids, as objects are unordered and ordering is important
    };                   //important because order determines which team a player is on. TODO find a better way to do this
    Rating.find({
      'userid': { $in: playerIds}
    }, function (err, ratings) {
      playerIds.forEach(function(id, index) {
        if (!ratings[index]) {
          ratings[index] = new Rating({userid: id});
          ratings[index].save();
        }
        lobbyObject.users[id] = {
          'name': OnlineUser.getName(id),
          'role': 0,
          'ready': lobbies[req.params.lobby].ready.indexOf(id) > 0,
          'mu': Math.round(ratings[index].mu)
        };
      });
      res.status(200).json(lobbyObject);
    });
  },

  join: function(req, res, next) {
    var lobbyData = lobbies[req.params.lobby];
    if (!lobbyData)
      res.status(500).json("Lobby not found");
    //Player should not be able to join a lobby if already in a lobby. We need to do a few extra checks
    //even if req.session.lobby is set, as the lobby might not exist anymore or the user could have
    //been forced out of it.
    else if (req.session.lobby && lobbies[req.session.lobby] && 
             lobbies[req.session.lobby].players.indexOf(req.session.userid) > 0) 
    res.status(500).json("Already in lobby");
    else if (lobbyData.players.length < 4){
      lobbyData.players.push(req.session.userid);
      req.session.lobby = req.params.lobby;
      res.status(200).json("Joined lobby" + req.params.lobby);
    }
    else
      return res.status(409).json("Lobby Full");
  },

  leave: function(req, res, next) {
    if (!req.session.lobby) //if the session says the client isn't in a lobby, do nothing.
      res.status(500).json("Lobby variable in session is null");
    else {
      var lobby = req.session.lobby;
      var lobbyData = lobbies[lobby];
      req.session.lobby = null;
      if (!lobbyData) //do nothing if lobby does not exist
        res.status(500).json("Lobby not found");
      else if (lobbyData.host === req.session.userid){ //disband lobby if the host left
        delete lobbies[lobby];
        res.status(200).json("Lobby disbanded");
        LobbyEvents.emit('l:disband', lobby);
      }
      else {
        var index = lobbyData.players.indexOf(req.session.userid);
        if (index < 0) //Do nothing if our client isn't actually in the lobby it says it is in
          res.status(500).json("Not in lobby");
        lobbyData.players.splice(index, 1);
        //unready everyone when someone leaves
        lobbyData.ready = [];
        if(lobbyData.players.length === 0){ //if lobby is now empty, remove it.
          delete lobbies[lobby];
          res.status(200).json("Lobby disbanded");
          LobbyEvents.emit('l:disband', lobby);
        }
        else
          res.status(200).json({});
      }
    }
  },

  ready: function(req, res, next) {
    if (!req.session.lobby) {
      console.log(req.session.userid + " used ready from lobby api but no lobby variable is set in session");
      res.status(409).json({});
    }
    else if (!lobbies[req.session.lobby]) {
      console.log("lobby.ready, lobby not found. userid:" + req.session.userid);
      res.status(409).json({});
    }
    else if (lobbies[req.session.lobby].ready.indexOf(req.session.userid) > 0)
      res.status(409).json("Already ready");
    else {
      lobbies[req.session.lobby].ready.push(req.session.userid);
      //if everyone is ready, start the game
      if (lobbies[req.session.lobby].ready.length >= lobbies[req.session.lobby].players.length) {
        //this.start(req, res, next);
        RatingCtrl.findBalancedTeams(lobbies[req.session.lobby].players)
        .then(function (result) {
            lobbies[req.session.lobby].players = result;
            lobbies[req.session.lobby].inProgress = true;
            return res.status(200).json(true);
        });
      }
      else
        res.status(200).json(false);
    }
  },

  unready: function(req, res, next) {
    if (!req.session.lobby) {
      console.log(req.session.userid + " used unready from lobby api but no lobby variable is set in session");
      res.status(409).json({});
    }
    else if (!lobbies[req.session.lobby]) {
      console.log("lobby.unready, lobby not found. userid:" + req.session.userid);
      res.status(409).json({});
    }
    else {
      var index = lobbies[req.session.lobby].ready.indexOf(req.session.userid);
      if (index < 0) {
        res.status(409).json("Not ready");
        console.log(req.session.userid + " used unready but was not found in ready array");
      }
      else {
        lobbies[req.session.lobby].ready.splice(index, 1);
        res.status(200).json({});
      }
    }
  },

  /* this code has been moved to the rating controller's findBalancedTeams function
   * can delete this once i know there are no issues due to the change
  start: function (req, res, next) {
    var lobbyObject = lobbies[req.session.lobby];
    if (lobbyObject.players.length != lobbyObject.ready.length) {
      console.log(req.session.lobby + " tried to start but players and ready array have different values");
      res.status(409).json({});
      return;
    }
    var options = {
      args: [],
      scriptPath: './server/components/matchmaking'
    }; 

    Rating.find({
      'userid': { $in: lobbyObject.players}
    }, function (err, ratings) {
      //every two numbers in our args array corresponds to a player's 
      //mu and sigma respectively. 
      _.each(lobbyObject.players, function (userid, index) {
        var rating = ratings[index];
        if (!rating) {
          rating = new Rating({'userid': userid});
          rating.save();
        }
        options.args.push(rating.mu);
        options.args.push(rating.sigma);
      });
      var indices = [];

      PythonShell.run('find_balanced_teams.py', options, function (err, results) {
        if(err) throw err;
        indices = JSON.parse(results[0]);
        var balancedPlayers = [];
        _.each(indices, function (index) {
          balancedPlayers.push(lobbyObject.players[index]);
        });
        lobbyObject.players = balancedPlayers;
        lobbyObject.inProgress = true;
        //tell the client we successfully balanced the lobby. They can get the results with the 
        //get api call. If it's possible to cache the results of this api call we just send only
        //the data that was changed in this one, rather than getting the whole lobby again.
        res.status(200).json(true);
      });
    });
  },*/
  //TODO rewrite using promises and move relevant code to rating controller
  //lobby controller should only check if the winner has been decided. This check isn't even coded
  //in yet, but winner should be decided by first team to reach majority vote. Thats the only
  //part lobby controller should handle.
  voteWinner: function (req, res, next) {
    //for now, only 1 vote is needed to declare a winner. In the future, winner
    //will be decided by majority vote.
    //Also, we will use the ready array to hold the ids of players who have NOT voted yet
    //May be better to move to a different array later

    if (lobbies[req.session.lobby].ready.indexOf(req.session.userid) < 0) {
      res.status(409).json("Already voted");
      return;
    }
    lobbies[req.session.lobby].ready.splice(lobbies[req.session.lobby].ready.indexOf(lobbies[req.session.userid]), 1);
    var players = lobbies[req.session.lobby].players;
    var rankings = req.params.winner == '0' ? [0, 1] : [1, 0];
    var options = {
      args: [rankings[0], rankings[1]],
      scriptPath: './server/components/matchmaking'
    }; 
    //every two numbers in our args array corresponds to a player's 
    //mu and sigma respectively. 
    Rating.find({
      'userid': { $in: lobbies[req.session.lobby].players}
    }, function (err, ratings) {
      //every two numbers in our args array corresponds to a player's 
      //mu and sigma respectively. 
      _.each(players, function (userid, index) {
        var rating = ratings[index];
        options.args.push(rating.mu);
        options.args.push(rating.sigma);
      });
      PythonShell.run('recalculate_ratings.py', options, function (err, results) {
        if(err) throw err;
        newRatings = JSON.parse(results[0]);
        _.each(newRatings, function (rating, index) {
          ratings[index].mu = rating.mu;
          ratings[index].sigma = rating.sigma;
          ratings[index].save();
        });
        //delete lobby
        delete lobbies[req.session.lobby];
        LobbyEvents.emit('l:disband', req.session.lobby);
        //remove user from ready array as he or she has already voted 
        res.status(200).json(true);
      });
    });
  },
  disconnect: function(lobby, id) {
    if (lobbies[lobby])
      if (lobbies[lobby].players[id])
        lobbies[lobby].players.splice(lobbies[lobby].players.indexOf(id), 1);
  },

  isActiveLobby: function(lobby) {
    if (!lobbies[lobby])
      return false;
    else
      return lobbies[lobby].inProgress;
  }

};
