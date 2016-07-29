var usernum = 1;
var User = require('./api/user/user.controller.js');
var Rating = require('./api/rating/rating.controller.js');
var Lobby = require('./api/lobby/lobby.controller');
import config from './config/environment';
module.exports = function(app) {


//TODO put remaining logic below in controllers
app.use('/api/lobbies', require('./api/lobby'));
app.get('/api/user/self', function(req, res, next) {
  var self = {};
  self.name = req.session.name;
  self.userid = req.session.userid;
  self.lobbySize = config.lobbySize;
  //A user is not disconnected from an active lobby even if the session is destroyed,
  //so if the session variable for lobby is null we still need to check if our user's id is
  //associated with an active lobby. 
  if (req.session.lobby) { 
    self.lobby = Lobby.playerInLobby(req.session.lobby, self.userid) ? req.session.lobby : null;
  }
  else 
    self.lobby = User.getActiveLobby(self.userid);
  self.inActiveLobby = Lobby.isActiveLobby(req.session.lobby);
  res.status(200).json(self);
});


app.get('/login', function(req, res, next) {
  res.sendFile(app.get('clientPath') + '/login.html');
});

//temporary login for testing before integrating steam
app.post('/login', function(req, res, next) {
  req.session.userid = usernum;
  req.session.name = req.body.username;
  usernum += 1;
  res.redirect('/');
  User.setName(req.session.userid, req.session.name);
});

app.use('/auth', require('./auth').default);

app.get('/', function(req, res, next) {
  if (!req.session.userid)
    res.redirect('/login');
  else{
    if(!User.isOnline(req.session.userid))
      User.setName(req.session.userid, req.session.name);
    res.sendFile(app.get('clientPath') + '/index.html');
  }
});
};
