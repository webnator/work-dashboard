(function() {
  'use strict';

  angular
    .module('denizenDashboard.dashboard')
    .directive('imagePill', ImagePill);

  ImagePill.$inject = [];
  function ImagePill() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        section: '='
      },
      templateUrl: 'app/dashboard/directives/image-pill/imagePill.html'
    };
  }
})();

