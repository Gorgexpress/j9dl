import Main from './main.service';
import MainCtrl from './main.controller';
require('./main.css');
var app = require('angular').module('myApp');

app.service('Main', Main)
  .controller('MainCtrl', MainCtrl);
