import express from 'express';
import * as auth from '../../auth/auth.service';
import * as controller from './lobby.controller';

var router = express.Router();

router.get('/list', auth.isAuthenticated(), controller.list);
router.get('/get/:lobby', auth.isAuthenticated(), controller.get);
router.get('/join/:lobby', auth.isAuthenticated(), controller.join);
router.get('/leave', auth.isAuthenticated(), controller.leave);
router.get('/ready', auth.isAuthenticated(), controller.ready);
router.get('/unready', auth.isAuthenticated(), controller.unready);
router.get('/voteWinner/:winner', auth.isAuthenticated(),controller.voteWinner);
router.post('/create/:name', auth.isAuthenticated(), controller.create);

module.exports = router;
