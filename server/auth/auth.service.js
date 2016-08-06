import passport from 'passport';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import User from '../api/user/user.model';
import compose from 'composable-middleware';

var validateJwt = expressJwt({
  secret: config.secrets.session
});

export function isAuthenticated() {
  return compose()
    .use(function(req, res, next) {
      if (req.query && req.query.hasOwnProperty('access_token'))
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      if (req.query && typeof req.headers.authorization === 'undefined')
        req.headers.authorization = 'Bearer ' + req.cookies.token;
      validateJwt(req, res, next);
    })
    .use(function(req, res, next) {
      User.findById(req.user._id).exec()
        .then(user => {
          if (!user)
            return res.status(401).end();
          req.user = user;
          next();
        })
        .catch(err => next(err));
    });
}
export function signToken(id, role) {
  return jwt.sign({ _id: id, role: role }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

export function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('You aren\'t logged in!');
  }
  let token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}
