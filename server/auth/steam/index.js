import express from 'express';
import passport from 'passport';

var router = express.Router();

router.get('/', passport.authenticate('steam', {
  failureRedirect: '/login',
  session: false
}));

export default router;
