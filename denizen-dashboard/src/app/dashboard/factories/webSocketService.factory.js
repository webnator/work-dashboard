(function() {
  'use strict';

  angular
    .module('denizenDashboard.dashboard')
    .factory('webSocketService', webSocketService);

  webSocketService.$inject = ['$websocket'];
  function webSocketService($websocket) {
    var vm = {};
    var events = {};
    var ws;

    vm.connect = function (callback) {
      ws = $websocket.$new('ws://localhost:9800');

      ws.$on('$open', function () {
        console.log('Socket opened');
        callback();
      });

    };

    vm.registerEvent = function (eventType, callback) {
      if (!events[eventType]) {
        setAction(eventType, callback);

        events[eventType] = {
          callback: callback
        };
      }

    };

    vm.getRegisteredEvents = function () {
      return events;
    };

    vm.unregisterEvent = function (eventType) {
      if (events[eventType]) {
        removeAction(eventType);

        delete events[eventType];
      }
    };

    function setAction(eventType, callback) {
      return ws.$on(eventType, callback);
    }

    function removeAction(eventType) {
      return ws.$un(eventType);
    }

    return vm;
  }
})();
