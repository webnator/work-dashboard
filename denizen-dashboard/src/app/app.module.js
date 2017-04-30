(function() {
  'use strict';

  angular.module('denizenDashboard', [
    'ui.router',
    'ui.bootstrap',
    'ds.clock',

    'denizenDashboard.dashboard'
  ])
    .constant('_', window._);

})();
