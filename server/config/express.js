import config from './environment';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
const redisStore = require('connect-redis')(session);
if(process.env.REDIS_URL) //necessary for heroku
  var client = redis.createClient(process.env.REDIS_URL);
else
  var client = redis.createClient();
import bodyParser from 'body-parser';
import path from 'path';

export default function(app) {
  var sessionMiddleware = session({
    secret: config.secrets.session,
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
  });
  app.use(sessionMiddleware);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());
  app.use(passport.initialize());

  app.set('view engine', 'html');
  app.set('clientPath', path.join(__dirname, '../../client'));
  return sessionMiddleware;
}
