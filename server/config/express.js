var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
if(process.env.REDIS_URL) //necessary for heroku
  var client = redis.createClient(process.env.REDIS_URL);
else
  var client = redis.createClient();
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app) {

  app.use(session({
    secret: 'ergvergerg',
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.set('view engine', 'html');
  app.set('clientPath', path.join(__dirname, '../../client/'));

};