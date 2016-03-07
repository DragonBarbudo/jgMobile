var moduleapp = angular.module('JagerginMobileApp',
  [
    'onsen',
    'ui.router',
    'angular-loading-bar',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'geolocation',
    'uiGmapgoogle-maps',
    'slick',
    'ngScrollable'
  ]);






moduleapp.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  //for cors
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/view/mainNav.html',
      //controller: 'ProductsViewCtrl'
    });
    $urlRouterProvider.otherwise('/');
});
