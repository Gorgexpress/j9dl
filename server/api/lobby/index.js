
var express = require('express');
var controller = require('./lobby.controller');

var router = express.Router();

router.get('/list', controller.list);
router.get('/get/:lobby', controller.get);
router.get('/join/:lobby', controller.join);
router.get('/leave', controller.leave);
router.get('/ready', controller.ready);
router.get('/unready', controller.unready);
//router.get('/start', controller.start);
router.get('/voteWinner/:winner', controller.voteWinner);
router.post('/create/:name', controller.create);

module.exports = router;
