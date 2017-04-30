(function() {
  'use strict';

  angular
    .module('denizenDashboard.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$timeout', '_', 'sectionService', 'webSocketService'];
  function DashboardController($timeout, _, sectionService, webSocketService) {
    var vm = this;

    /** Constants declaration */
    var TOTAL_CARDS = 7;
    var SELECTED_POSITION = 3;
    var NORMAL_CYCLE_PERIOD = 5 * 1000;
    var ANIMATION_DURATION = 500;
    var FAST_CYCLE_PERIOD = 200;
    vm.ANIMATION_DIRECTION = {
      UP: 'up',
      DOWN: 'down'
    };

    /** Private variables declaration */
    var contents = [];
    var contentIndex = 0;
    var cycle_period = NORMAL_CYCLE_PERIOD;
    var animationDirection = vm.ANIMATION_DIRECTION.UP;
    var sockets_to_register = [
      { event: 'section', executeFunction: selectSection }
    ];

    /** Controller variables declaration */
    vm.isCycling = false;
    vm.currentContents = [];
    vm.selectedCard = null;
    vm.isCardSelected = false;

    /** Controller functions assignment */
    vm.selectCard = selectCard;
    vm.selectSection = selectSection;
    vm.resumeAnimation = resumeAnimation;

    /** Initialization */
    init();

    /** Functions declaration */
    function init() {
      sectionService.getSections().then(function (sectionData) {
        contents = sectionData;
        registerSockets();
        setCurrentContents();
        console.log('Call cycle', 'init');
        cycleContent();
      }, function (err) {
        console.log('Error loading sections', err);
      });
    }

    function registerSockets() {
      for (var i = 0; i < sockets_to_register.length; i++) {
        var socket = sockets_to_register[i];
        webSocketService.connect(function () {
          webSocketService.registerEvent(socket.event, socket.executeFunction);
        });
      }
    }

    function cycleContent() {
      if (vm.isCycling === false) {
        vm.isCycling = animationDirection;
        console.log('Setting timeout for', ANIMATION_DURATION);
        $timeout(function () {
          setCurrentContents();
          vm.isCycling = false;

          console.log('timeout', isCardSelected(), cycle_period, ANIMATION_DURATION);
          if (!isCardSelected()) {
            console.log('Setting timeout from cycle');
            $timeout(cycleContent, cycle_period);
          }

        }, ANIMATION_DURATION);
      }
    }

    function setCurrentContents() {
      if (animationDirection === vm.ANIMATION_DIRECTION.UP) {
        contentIndex++;
      } else {
        contentIndex--;
      }

      if (contentIndex >= contents.length) {
        contentIndex = 0;
      } else if(contentIndex < 0) {
        contentIndex = contents.length - 1;
      }
      var newContents = [];
      for (var i = contentIndex; i < contentIndex + TOTAL_CARDS; i++) {
        if (i >= contents.length) {
          newContents.push(contents[i - contents.length]);
        } else {
          newContents.push(contents[i]);
        }
      }
      vm.currentContents = newContents;
    }

    function selectCard(cardNumber) {
      var cardIndex = parseInt(cardNumber);
      if (!isNaN(cardIndex) && cardIndex >= 0 && cardIndex < contents.length) {
        vm.selectedCard = contents[cardIndex];

        if (vm.currentContents[SELECTED_POSITION].id === vm.selectedCard.id) {
          // Already in that card
          console.log('Already in Card');
          return;
        }
        vm.isCardSelected = false;

        var selectedObject = vm.currentContents[SELECTED_POSITION];
        var currentIndex = _.findIndex(contents, function(o) { return o.id === selectedObject.id; });
        animationDirection = chooseDirection(cardNumber, currentIndex, contents.length);
        console.log('Call cycle', 'selectCard');
        cycleContent();
      } else {
        console.log('INVALID CARD INDEX SELECTION', cardNumber);
      }
    }

    function selectSection(section_id) {
      let cardIndex = _.findIndex(contents, {id: section_id});
      if (cardIndex >= 0) {
        selectCard(cardIndex);
      } else {
        resumeAnimation();
      }
    }

    function chooseDirection(selected, current, total) {
      var middle = Math.floor(total / 2);
      if (selected > current) {
        if ((selected - current) >= middle) {
          return vm.ANIMATION_DIRECTION.DOWN;
        } else {
          return vm.ANIMATION_DIRECTION.UP;
        }
      } else {
        if ((current - selected) >= middle) {
          return vm.ANIMATION_DIRECTION.UP;
        } else {
          return vm.ANIMATION_DIRECTION.DOWN;
        }
      }
    }

    function isCardSelected() {
      if (vm.selectedCard !== null) {
        if (vm.currentContents[SELECTED_POSITION].id === vm.selectedCard.id) {
          cycle_period = NORMAL_CYCLE_PERIOD;
          vm.isCardSelected = true;
          return true;
        }
        cycle_period = FAST_CYCLE_PERIOD;
        vm.isCardSelected = false;
        return false;
      }
      cycle_period = NORMAL_CYCLE_PERIOD;
      vm.isCardSelected = false;
      return false;
    }

    function resumeAnimation() {
      animationDirection = vm.ANIMATION_DIRECTION.UP;
      vm.selectedCard = null;
      console.log('Call cycle', 'resume');
      cycleContent();
    }

  }
})();
