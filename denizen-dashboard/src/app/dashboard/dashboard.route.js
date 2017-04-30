(function () {
  'use strict';

  angular
    .module('denizenDashboard.dashboard')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        // views: {
        //   '': {
        //     templateUrl: 'app/dashboard/dashboard.html',
        //   },
        //   'background@dashboard': {
        //     templateUrl: 'app/dashboard/views/_background.partial.html'
        //   },
        //   'top-bar@dashboard': {
        //     templateUrl: 'app/dashboard/views/_topBar.partial.html'
        //   },
        //   'bottom-bar@dashboard': {
        //     templateUrl: 'app/dashboard/views/_bottomBar.partial.html'
        //   }
        // }
      });
  }
}());

