var usernum = 1;
import {getActiveLobby, setName, isOnline} from './api/user/user.controller.js';
import {playerInLobby, isActiveLobby} from './api/lobby/lobby.controller';
import config from './config/environment';

export default function(app) {


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
    self.lobby = playerInLobby(req.session.lobby, self.userid) ? req.session.lobby : null;
  }
  else 
    self.lobby = getActiveLobby(self.userid);
  self.inActiveLobby = isActiveLobby(req.session.lobby);
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
  setName(req.session.userid, req.session.name);
});

app.use('/auth', require('./auth').default);

app.get('/', function(req, res, next) {
  if (!req.session.userid)
    res.redirect('/login');
  else{
    if(!isOnline(req.session.userid))
      setName(req.session.userid, req.session.name);
    res.sendFile(app.get('clientPath') + '/index.html');
  }
});
}
