import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from 'angular-ui-router';
var app = angular.module('myApp', ['ui.bootstrap', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider
      .otherwise('/');
  });

require('./main/main.js');
require('./main');
require('./lobbylist');
require('./lobbyinfo');
require('./chat');
require('../components');
