var usernum = 1;
var data = require('./config/data.js');
module.exports = function(app, controllers) {
  /* GET home page. */

app.get('/', function(req, res, next) {
  if (!req.session.userid)
    res.redirect('/login');
  else{
    if(!data.users[req.session.userid])
      data.users[req.session.userid] = req.session.name;
    res.sendFile(app.get('clientPath') + 'index.html');
  }
});

app.get('/api/lobbies/list', controllers.list);
app.get('/api/lobbies/get/:lobby', controllers.get);
app.get('/api/lobbies/join/:lobby', controllers.join);
app.get('/api/lobbies/leave', controllers.leave);
app.get('/api/user/list', function(req, res, next){
  res.status(200).json(data.users);
});

app.post('/api/lobbies/create/:name', controllers.create);

app.get('/login', function(req, res, next) {
  res.sendFile(app.get('clientPath') + 'login.html');
});

//temporary login for testing before integrating steam
app.post('/login', function(req, res, next) {
  req.session.userid = usernum;
  req.session.name = req.body.username;
  usernum += 1;
  res.redirect('/');
  data.users[req.session.id] = req.body.username;
});

};