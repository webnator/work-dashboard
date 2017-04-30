(function() {
  'use strict';

  angular
    .module('denizenDashboard.dashboard')
    .directive('imageMain', ImageMain);

  ImageMain.$inject = [];
  function ImageMain() {
    return {
      restrict: 'E',
      templateUrl: 'app/dashboard/directives/images/imageMain.html'
    };
  }
})();
