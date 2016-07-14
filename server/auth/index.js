import config from '../config/environment';
import express from 'express';
import passport from 'passport';

require('./steam/passport').setup(config);

var router = express.Router();

router.use('/steam', require('./steam').default);

export default router;
