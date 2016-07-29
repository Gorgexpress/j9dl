import User from './user.model';
import _ from 'lodash';
/*
var users = {
  20: {
    name: 'Deadprez',
    lobby: null
  },
  25: {
    name: 'vlv',
    lobby: null
  },
  26: {
    name: 'pojo',
    lobby: null
  },
  27: {
    name: 'shyrazn',
    lobby: null
  }
};
*/
const users = {};


export function getSelf(req, res, next) {
  let self = {
    'name': req.session.name,
    'userid': req.session.userid,
    'lobby': req.session.lobby
  };
  res.status(200).json(self);
}
export function getName(id) {
  return users[id].name;
}
export function setName(id, name) {
  if (users[id])
    users[id].name = name;
  else
    users[id] = {
      'name': name,
      lobby: null
    };
}
export function isOnline(id) {
  return users[id] ? true : false;
}

//delete the lobby variable for all user ids in the userids array
export function unsetLobby(userids) {
  _.each(userids, function (userid) {
    users[userid].lobby = null;
  });
}

export function getActiveLobby(userid) {
  if (!users[userid] || !users[userid].lobby)
    return null;
  return users[userid].lobby;
}
//returns users object, not currently used.
export function listOnline() {
  return users;
}

