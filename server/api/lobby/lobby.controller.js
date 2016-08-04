import Rating from '../rating/rating.model.js';
import {rate, findBalancedTeams} from '../rating/rating.controller';
import PythonShell from 'python-shell';
import LobbyEvents from './lobby.events';
import {getName, unsetLobby}  from '../user/user.controller';
import config from '../../config/environment';
import _ from 'lodash';
/*
var lobbies = {
  '-APEM pros only': {
    'players': [20],
    'forbid': [1000],
    'host': 20,
    'inProgress': false,
    'canVote': false,
    'ready': []
  },
  'ARDM': {
    'players': [25, 26, 27],
    'forbid': [2000],
    'host': 25,
    'inProgress': false,
    'canVote': false,
    'ready': [25, 26, 27]
  }
};
*/
const lobbies= {};

export function list(req, res, next) {
  res.status(200).json(_.mapValues(lobbies, 'players.length'));
}

export function create(req, res, next) {
  if (lobbies[req.params.name])
    res.status(409).send({});
  else {
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
}

export function get(req, res, next) {
  let playerIds = lobbies[req.params.lobby].players;
  let lobbyObject = {
    'host': lobbies[req.params.lobby].host,
    'users': {},
    'readyCount': lobbies[req.params.lobby].ready.length,
    'inProgress': lobbies[req.params.lobby].inProgress,
    'canVote': lobbies[req.params.lobby].canVote,
    'order': playerIds //ordered array of ids, as objects are unordered and ordering is important
  };                   //important because order determines which team a player is on. TODO find a better way to do this
  Rating.find({
    'userid': { $in: playerIds}
  }, null, {sort: {userid: 1}}).exec()
    .then( ratings => {
      _.sortBy(playerIds).forEach(function(id, index) {
        if (!ratings[index]) {
          ratings[index] = new Rating({userid: id});
          ratings[index].save();
        }
        lobbyObject.users[id] = {
          'name': getName(id),
          'role': 0,
          'ready': lobbies[req.params.lobby].ready.indexOf(id) > 0,
          'mu': Math.round(ratings[index].mu)
        };
      });
      res.status(200).json(lobbyObject);
    })
    .catch(err => res.status(409).json(false));
}

export function join(req, res, next) {
  let lobbyData = lobbies[req.params.lobby];
  if (!lobbyData)
    res.status(500).json("Lobby not found");
  //Player should not be able to join a lobby if already in a lobby. We need to do a few extra checks
  //even if req.session.lobby is set, as the lobby might not exist anymore or the user could have
  //been forced out of it.
  else if (req.session.lobby && lobbies[req.session.lobby] && 
    lobbies[req.session.lobby].players.indexOf(req.session.userid) > 0) 
  res.status(500).json("Already in lobby");
  else if (lobbyData.players.length < config.lobbySize){
    lobbyData.players.push(req.session.userid);
    req.session.lobby = req.params.lobby;
    res.status(200).json("Joined lobby" + req.params.lobby);
  }
  else
    return res.status(409).json("Lobby Full");
}

export function leave(req, res, next) {
  if (!req.session.lobby) //if the session says the client isn't in a lobby, do nothing.
    res.status(500).json("Lobby variable in session is null");
  else {
    let lobby = req.session.lobby;
    let lobbyData = lobbies[lobby];
    req.session.lobby = null;
    if (!lobbyData) //do nothing if lobby does not exist
      res.status(500).json("Lobby not found");
    else if (lobbyData.host === req.session.userid){ //disband lobby if the host left
      delete lobbies[lobby];
      res.status(200).json("Lobby disbanded");
      LobbyEvents.emit('l:disband', lobby);
    }
    else {
      let index = lobbyData.players.indexOf(req.session.userid);
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
}

export function ready(req, res, next) {
  let lobbyObject = lobbies[req.session.lobby];
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
      lobbies[req.session.lobby].players.sort(); 
      findBalancedTeams(lobbies[req.session.lobby].players)
        .then(function (result) {
          lobbies[req.session.lobby].players = result;
          lobbies[req.session.lobby].inProgress = true;
          //enable voting after a set amount of time
          setTimeout( function enableVoting() {
            if(lobbyObject) {
              lobbyObject.canVote = true;
              LobbyEvents.emit('l:enableVote', req.session.lobby);
            }
          }, 300);
          return res.status(200).json(true);
        });
    }
    else
      res.status(200).json(false);
  }
}

export function unready(req, res, next) {
  if (!req.session.lobby) {
    console.log(req.session.userid + " used unready from lobby api but no lobby variable is set in session");
    res.status(409).json({});
  }
  else if (!lobbies[req.session.lobby]) {
    console.log("lobby.unready, lobby not found. userid:" + req.session.userid);
    res.status(409).json({});
  }
  else {
    let index = lobbies[req.session.lobby].ready.indexOf(req.session.userid);
    if (index < 0) {
      res.status(409).json("Not ready");
      console.log(req.session.userid + " used unready but was not found in ready array");
    }
    else {
      lobbies[req.session.lobby].ready.splice(index, 1);
      res.status(200).json({});
    }
  }
}

/* this code has been moved to the rating controller's findBalancedTeams function
 * can delete this once i know there are no issues due to the change
 start: function (req, res, next) {
 var lobbyObject = lobbies[req.session.lobby];
 if (lobbyObject.players.length != lobbyObject.ready.length) {
 console.log(req.session.lobby + " tried to start but players and ready array have different values");
 res.status(409).json({});
 */
export function voteWinner(req, res, next) {
  //for now, only 1 vote is needed to declare a winner. In the future, winner
  //will be decided by majority vote.
  //Also, we will use the ready array to hold the ids of players who have NOT voted yet
  //May be better to move to a different array later

  if (lobbies[req.session.lobby].ready.indexOf(req.session.userid) < 0) {
    res.status(409).json("Already voted");
    return;
  }
  res.status(200).json(true);
  lobbies[req.session.lobby].ready.splice(lobbies[req.session.lobby].ready.indexOf(lobbies[req.session.userid]), 1);
  //return if atleast half the players havent voted yet.
  if (lobbies[req.session.lobby].ready.length > config.lobbySize/ 2)
    return;
  let players = lobbies[req.session.lobby].players;
  let rankings = req.params.winner == '0' ? [0, 1] : [1, 0];

  rate(lobbies[req.session.lobby].players, rankings)
    .then(function () {
      LobbyEvents.emit('l:disband', req.session.lobby);
      unsetLobby(lobbies[req.session.lobby].players);
      delete lobbies[req.session.lobby];
    });
}
export function disconnect(lobby, id) {
  if (lobbies[lobby] && !lobbies[lobby].inProgress) {
    let index = lobbies[lobby].players.indexOf(id);
    if (index > 0)
      lobbies[lobby].players.splice(index, 1);
  }
}
//join without using an http request
//false if lobby does not exist, true otherwise
export function joinNoReq(lobby, userid) {
  if (!lobbies[lobby])
    return false;
  lobbies[lobby].players.push(userid);
  return true;
}

export function isActiveLobby(lobby) {
  if (!lobbies[lobby])
    return false;
  else
    return lobbies[lobby].inProgress;
}

export function playerInLobby(lobby, userid)  {
  if (!lobbies[lobby])
    return false;
  return lobbies[lobby].players.indexOf(userid) > 0;
}

