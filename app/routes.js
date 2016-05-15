module.exports = function(app) {
  /* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

};
