module.exports = function(app, controllers) {
  /* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/lobbies/list', controllers.list);
app.post('/api/lobbies/create/:name', controllers.create);
};
