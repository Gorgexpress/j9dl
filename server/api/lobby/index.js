import express from 'express';
import * as controller from './lobby.controller';

var router = express.Router();

router.get('/list', controller.list);
router.get('/get/:lobby', controller.get);
router.get('/join/:lobby', controller.join);
router.get('/leave', controller.leave);
router.get('/ready', controller.ready);
router.get('/unready', controller.unready);
router.get('/voteWinner/:winner', controller.voteWinner);
router.post('/create/:name', controller.create);

module.exports = router;
