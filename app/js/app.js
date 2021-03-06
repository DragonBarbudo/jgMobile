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
    'ngScrollable',
    'cfp.loadingBar',
    'ngCordova',
    'ngCordovaOauth',
    'LocalStorageModule'
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
    })
    .state('facebook',{
      url: '/auth/facebook'
    })
    .state('google',{
      url: '/auth/google'
    });
    $urlRouterProvider.otherwise('/');



});


moduleapp.run(function($rootScope, localStorageService){

  //Esconder / Mostar Mapa
  $rootScope.zona = false;

  $rootScope.loggedin = false;
  $rootScope.userApp = {};
  $rootScope.userApp.client;
  $rootScope.userApp.access;
  $rootScope.userApp.id;
  $rootScope.userApp.name;
  $rootScope.userApp.picture;

  //hello.init({ facebook : '613671772113193', google: '473012819-cv5rgbmt6tjf8h4b8h2go7a4f89q9g6r.apps.googleusercontent.com' }, { redirect_uri:'http://jagergin.com/auth/redirect.html' });
  //hello.init({ facebook : '613690458777991', google: '473012819-cv5rgbmt6tjf8h4b8h2go7a4f89q9g6r.apps.googleusercontent.com' }, { redirect_uri:'redirect.html' });
  if(localStorageService.get('user')){
    $rootScope.userApp = localStorageService.get('user');
    $rootScope.loggedin = true;
  }

});


moduleapp.directive('img', function () {
    var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", 'app/img/notfound.png');
      });
    }
   }
   return fallbackSrc;
});
