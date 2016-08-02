import Main from './main.service';
import MainCtrl from './main.controller';
var app = require('angular').module('myApp');

app.service('Main', Main)
  .controller('MainCtrl', MainCtrl);
