import passport from 'passport';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';


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
