(function () {
  'use strict';

  angular
    .module('denizenDashboard')
    .config(config);

  function config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }
}());