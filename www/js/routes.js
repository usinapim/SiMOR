angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.notificaciones', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/notificaciones.html',
        controller: 'notificacionesCont'
      }
    }
  })

  .state('tabsController.altura', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/altura.html',
        controller: 'alturaCont'
      }
    }
  })

  .state('tabsController.mapa', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/mapa.html',
        controller: 'mapaCont'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('acerca-de', {
    url: '/acerca-de',
    templateUrl: 'templates/acerca-de.html',
  })


$urlRouterProvider.otherwise('/page1/page3');

  

});