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


moduleapp.run(function($rootScope){

  $rootScope.loggedin = false;
  $rootScope.userApp = {};
  $rootScope.userApp.client;
  $rootScope.userApp.access;
  $rootScope.userApp.id;
  $rootScope.userApp.name;
  $rootScope.userApp.picture;

  hello.init({ facebook : '613671772113193' }, { redirect_uri:'http://jgmobile.sitio.ninja/redirect.html' });
  //hello.init({ facebook : '613690458777991' }, { redirect_uri:'redirect.html' });

  hello('facebook').login({
    scope: 'email'
  });

  hello.on('auth.login', function(auth) {



    if(auth){
      $rootScope.loggedin   = true;
      $rootScope.userApp.client     = auth.authResponse.client_id;
      $rootScope.userApp.access     = auth.authResponse.access_token;
    }

    hello(auth.network).api('/me').then(function(r) {
      $rootScope.userApp.name = r.name;
      $rootScope.userApp.email = r.email;
      $rootScope.userApp.picture = r.picture;
      console.log(r);
    });

  });




});
