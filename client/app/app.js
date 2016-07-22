var app = angular.module('myApp', ['ui.bootstrap', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider
      .otherwise('/');
  });
