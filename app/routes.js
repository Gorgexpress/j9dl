var usernum = 1;
var users = [];

module.exports = function(app, controllers) {
  /* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/lobbies/list', controllers.list);
app.get('/api/user/list', function(req, res, next){
  if(!req.session.name){ //will want to move this to a login method eventually
    req.session.name = usernum;
    users.push("User" + usernum);
    usernum++;
  }
  console.log(req.session);
  res.status(200).json(users);
});

app.post('/api/lobbies/create/:name', controllers.create);

};
