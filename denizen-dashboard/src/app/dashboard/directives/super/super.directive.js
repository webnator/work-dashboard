(function() {
  'use strict';

  angular
    .module('denizenDashboard.dashboard')
    .directive('superContainer', SuperContainer);

  SuperContainer.$inject = ['$compile'];
  function SuperContainer($compile) {
    return {
      restrict: 'E',
      scope: {
        section: '='
      },
      link: function (scope, elem) {
        elem.addClass('super-container');
        scope.$watch('section', function () {
          var section = scope.section;
          var htm_element = '<div></div>';

          if (section && section.type) {
            switch (section.type) {
              case 'img_placeholder':
                htm_element = '<image-pill section="section"></image-pill>';
                break;
            }
          }

          var compile = $compile(htm_element)(scope);
          elem.empty();
          elem.append(compile);
        });

      }
    };
  }
})();
