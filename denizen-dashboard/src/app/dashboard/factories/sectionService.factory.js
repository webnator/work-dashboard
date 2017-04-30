(function() {
  'use strict';

  angular
    .module('denizenDashboard.dashboard')
    .factory('sectionService', sectionService);

  sectionService.$inject = ['$q', '$http'];
  function sectionService($q, $http) {
    var vm = {};
    var sections = null;
    var SECTIONS_URL = 'http://localhost:9000/v1/dashboard/sections';

    vm.getSections = function() {
      return $q(function(resolve, reject) {
        if (sections && sections.length > 0) {
          return resolve(sections);
        }
        $http.get(SECTIONS_URL).then(function(res){
          console.log('RESS', res);
          if (res.status === 200) {

            sections = res.data.data;
            return resolve(sections);
          } else {
            return reject({});
          }
        });
      });
    };

    return vm;
  }
})();
