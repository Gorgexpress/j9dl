import config from '../config/environment';
import express from 'express';
import passport from 'passport';
import User from '../api/user/user.model';
require('./steam/passport').setup(User, config);

var router = express.Router();

router.use('/steam', require('./steam').default);

export default router;
