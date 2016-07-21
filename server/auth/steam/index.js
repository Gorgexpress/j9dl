import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';
var router = express.Router();

//openid uses req.url but express uses req.originalUrl, so in the callback
//middleware we need to set the proper callback in req.url
router
  .get('/', passport.authenticate('steam', {
    failureRedirect: '/login',
    session: false
  }))
  .get('/callback', (req, res, next) => {
    req.url = req.originalUrl;
    next();
  }, passport.authenticate('steam', {
    failureRedirect: '/login',
    session: false
  }), setTokenCookie);

export default router;
