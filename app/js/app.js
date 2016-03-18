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
    'cfp.loadingBar'
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


moduleapp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    console.log(cfpLoadingBarProvider);
  }])


moduleapp.run(function($rootScope){



  $rootScope.loggedin = false;
  $rootScope.userApp = {};
  $rootScope.userApp.client;
  $rootScope.userApp.access;
  $rootScope.userApp.id;
  $rootScope.userApp.name;
  $rootScope.userApp.picture;

  hello.init({ facebook : '613671772113193', google: '473012819-cv5rgbmt6tjf8h4b8h2go7a4f89q9g6r.apps.googleusercontent.com' }, { redirect_uri:'http://mobile.prototipo.xyz/redirect.html' });
  //hello.init({ facebook : '613690458777991' }, { redirect_uri:'redirect.html' });

  //hello('facebook').login({ scope: 'email' });

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
      //console.log(r);
    });

  });
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
