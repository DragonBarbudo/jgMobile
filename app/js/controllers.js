
moduleapp.controller('PortadaCtrl', function($scope, CategoriesSvc, ShoppingCartSvc, $rootScope, uiGmapGoogleMapApi, uiGmapIsReady, geolocation, $location, $anchorScroll, $document, $cordovaGeolocation, cfpLoadingBar){


  //Navigator.pushPage('app/view/checkout.html');

  $('.waves').parallax({ limitY: 30, scalarX: 20 });

  $scope.isInZone = false;
  $scope.isInZone = "";


  $scope.cartCount;

  $scope.subcats = Navigator.getCurrentPage().options.subcat;
  $scope.categoriesList;

  CategoriesSvc.list().then(function(result){
    $scope.categoriesList = result.data;
  });



  $scope.categoryOpen = function(theid, thename, subs){
    if(subs==1){
      Navigator.pushPage('app/view/subcategorias.html', {subcat:theid});
    } else {
      Navigator.pushPage('app/view/productos.html', {cat:theid, nam:thename});
    }
  }

  $scope.$watch(function () {
       return ShoppingCartSvc.count();
     },
      function() {
        $scope.cartCount = ShoppingCartSvc.count();
    }, true);


  $scope.rSpace = function(thename){
    var sinSpacio = thename.replace(/ /g,"_");
    sinSpacio = sinSpacio.replace('ó', "o");
    sinSpacio = sinSpacio.replace('á', "a");
    var lowCase = sinSpacio.toLowerCase();
    return lowCase;
  }

  $scope.okZone = function(){
    $rootScope.zona = true;
  }



  console.log('running');


if(!$rootScope.zona){

  var posOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 0};
  $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      cfpLoadingBar.start();
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;

      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
            center: { latitude: lat, longitude: long },
          zoom: 11,
          options: {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            styles: gmapStyle
          }
        } //map

        $scope.polygons = zonaJagergin;
        $scope.marker = [ {id:0, options: { icon:'app/img/icon_marker.png' },
          coords: { latitude: lat, longitude: long }
        }]; //marker

        // ¿INSIDE JAGERGIN ZONE?
        if(!$rootScope.zona){
          var nupaths = { path:[ ] };
          for(var i=0;i<zonaJagergin.todo.path.length; i++){  nupaths.path.push( {lat:zonaJagergin.todo.path[i].latitude, lng:zonaJagergin.todo.path[i].longitude } );  }
          var point = new google.maps.LatLng(lat, long);
          var area = new google.maps.Polygon( {paths: nupaths.path });
          $scope.isInZone = area.containsLatLng(point);
        } // Inside


      });


    }, function(err) {
      // error
      alert('Debes tener la ubicación activa en tu dispositivo. Ingresa a los ajustes de tu dispositivo.');
      console.log(err);
    });

    uiGmapIsReady.promise(1).then(function(instances){
      cfpLoadingBar.complete();
    });
}



  $scope.scrollBottom = function(){
    $anchorScroll('thebottom');
  }


}) //ends PortadaCtrl

moduleapp.directive('svgSnap', function(){
  return{
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs){
      scope.getContentUrl = function(){
        return attrs.path;
      }
    },
    template: '<div ng-include="getContentUrl()"></div>'
  }
})




moduleapp.controller('ProductosCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, $filter) {
  $scope.navi = Navigator.getCurrentPage().options;
  $scope.categoryName = $scope.navi.nam;
  $scope.category = $scope.navi.cat;
  $scope.url = SettingSvc.getPhotoUrl();

  $scope.products;
  $scope.grid = true;

  $scope.cartCount;

  $scope.cantidades = [1,2,3,4,5,6,7,8,9,10];


  $scope.itemsInCart = ShoppingCartSvc.getCart();

  $('.waves').parallax({ limitY: 30, scalarX: 20 });


  ProductsSvc.findByCategoryId($scope.category).then(function(result){
    $scope.products = result.data;
  });

  $scope.addToCart = function(theItem){
    ShoppingCartSvc.addItem(theItem);
  }



  $scope.$watch(function () {
       return ShoppingCartSvc.count();
     },
      function() {
        $scope.cartCount = ShoppingCartSvc.count();
    }, true);


  $scope.InCart = function(ref){
    var found = $filter('filter')($scope.itemsInCart, {refId:ref}, true);
    if(found.length){ return true; } else { return false; }
  }


  $scope.rSpace = function(thename){
    var sinSpacio = thename.replace(/ /g,"_");
    sinSpacio = sinSpacio.replace('ó', "o");
    sinSpacio = sinSpacio.replace('á', "a");
    var lowCase = sinSpacio.toLowerCase();
    return lowCase;
  }



});











moduleapp.controller('BusquedaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, CategoriesSvc, $filter, $auth) {
  $scope.url = SettingSvc.getPhotoUrl();
  $scope.search="";
  $scope.searchResult = [];
  $scope.itemsInCart = ShoppingCartSvc.getCart();
  $scope.categories;
  $scope.cartCount;
  $scope.cantidades = [1,2,3,4,5,6,7,8,9,10];



  ProductsSvc.list(0, 1000, 0).then(function(resultPrd){

    CategoriesSvc.list().then(function(resultCat){
      $scope.products = resultPrd.data;
  		$scope.categories = resultCat.data;
      for(var i = 0; i<$scope.products.length; i++){
        var found = $filter('filter')($scope.categories, {id:$scope.products[i].categories_id}, true);
        $scope.products[i].categoryName = found[0].name;
      }

  	});

  });

  $scope.buscarProducto = function(){
    if($scope.search!=""){
      ProductsSvc.searchByName($scope.search).then(function(resultPrd){
        CategoriesSvc.list().then(function(resultCat){
          $scope.products = resultPrd.data;
      		$scope.categories = resultCat.data;
          for(var i = 0; i<$scope.products.length; i++){
            var found = $filter('filter')($scope.categories, {id:$scope.products[i].categories_id}, true);
            $scope.products[i].categoryName = found[0].name;
          }
      	});
      });
    }
  }

  $scope.addToCart = function(theItem){
    ShoppingCartSvc.addItem(theItem);
  }


    $scope.InCart = function(ref){
      var found = $filter('filter')($scope.itemsInCart, {refId:ref}, true);
      if(found.length){ return true; } else { return false; }
    }


  $scope.$watch(function () {
       return ShoppingCartSvc.count();
     },
      function() {
        $scope.cartCount = ShoppingCartSvc.count();
    }, true);


});



moduleapp.controller('CuentaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, UsersSvc, StoreLocalSvc, $filter, $rootScope, $auth, OrdersSvc) {


  $scope.choose     = true;
  $scope.signUpForm = false;
  $scope.signInForm = false;

  $scope.signin = {};
  $scope.userEdit = $rootScope.userApp;

  $scope.errorUsuario = false;
  $scope.errorPass = false;
  $scope.errorLogin = false;

  $scope.allValid = false;

  var prevProfile = {};
  prevProfile.name = $scope.userEdit.name;
  prevProfile.email = $scope.userEdit.email;
  prevProfile.tel = $scope.userEdit.tel;


  $scope.historial = {};
  $scope.historialItems = {};

$('.waves').parallax({ limitY: 30, scalarX: 20 });


  $scope.signup = function(){
    $scope.newUser = {};
    $scope.newUser.name = $scope.signin.name;
    $scope.newUser.password = $scope.signin.password;
    $scope.newUser.email = $scope.signin.email;
    $scope.newUser.tel = $scope.signin.tel;
    UsersSvc.createUser($scope.newUser).then(function(result){
      if(result.data){
        $rootScope.loggedin = true;
        $rootScope.userApp = $scope.newUser;
        $rootScope.userApp.id = result.data;
      }
    });
  }

  $scope.checkEmail = function(){
    if($scope.signin.email){
      UsersSvc.searchUser($scope.signin.email).then(function(result){
        //console.log(result.data.length);
        if(result.data){
          $scope.errorUsuario = 'Este correo ya esta registrado';
        } else {
          $scope.errorUsuario = false;
        }
      });
    }
  }

  $scope.validator = function(){
    if(!$scope.errorUsuario && $scope.signin.email && $scope.signin.name && $scope.signin.tel && $scope.signin.password && $scope.signin.password2 ){
      if($scope.signin.password != $scope.signin.password2){
        $scope.errorPass = "No coinciden las contraseñas";
        $scope.allValid = false;
      } else {
        $scope.errorPass = false;
        $scope.allValid = true;
      }

    }
  }

  $scope.login = function(){
    UsersSvc.loginUser($scope.loggingIn).then(function(result){
      if(!result.data){
        $scope.errorLogin = "Los datos de acceso son incorrectos.";
      } else {
        $scope.errorLogin = false;
        $rootScope.loggedin = true;
        $rootScope.userApp = result.data;

        cargarHistorial();

      }
    });
  }


  function cargarHistorial(){
    //Historial
    OrdersSvc.search($rootScope.userApp.email).then(function(result){
      //console.log(result.data);
      $scope.historial = result.data
      for(var i=0; i<$scope.historial.length; i++){
        OrdersSvc.items($scope.historial[i].id).then(function(resultItems){
             $scope.historial[i-1].items = resultItems.data;
        });
      }

    });
    //Termina historial

  }

  $scope.helloLogin = function(network){
    console.log('loginSo');
    /*
    $auth.authenticate(network).then(function(response){
      //loginNetwork(response);
      console.log('ok');
      console.log(response);
    }).catch(function(error){
      console.log('error');
      console.log(error);
    });
    */


//      var hi = hello(network);
/*      hi.login({ scope: 'email'}).then(function(r){
      console.log('login()');
        loginNetwork(r);
        return hi.api('me');
      }).then(loginNetwork,loginNetwork);
*/
      hello(network).login({ scope: 'email'}).then(function(rLogin){
        console.log(rLogin);
        hello(network).api('/me').then(function(r){
          loginNetwork(r);
        });
      });


  };

/*

  $scope.fbLogin = function(){
    hello('facebook').login({ scope: 'email'}).then(function(rLogin){



    }).then(loginWithNetwork, loginWithNetwork);
  }//fbLogin

  $scope.googleLogin = function(){
    hello('google').login({ scope: 'email' }, function(e){
      console.log(e);
    });
  }
*/


  function loginNetwork(r){
    console.log('loginNetwork()');
    console.log(r);
    //Validate Client_id
    UsersSvc.searchClientId(r.id).then(function(resultC){
      if(resultC.data){
        //Exists:TRUE | Then SIGNIN
        console.log('Client ID Exists. Signing In');
        $rootScope.userApp = resultC.data;
        $rootScope.loggedin = true;
        cargarHistorial();
      } else {
        //Exists:FALSE | Check if previous email
        console.log('Client ID null. Searching by Email');
        UsersSvc.searchUser(r.email).then(function(resultE){
          if(resultE.data){
            //Previous UserEmail: TRUE | Update & SIGNIN
              console.log('Client Email Exists. Updating with Network & Signing In');
              console.log(resultE.data.name);
              $rootScope.userApp = resultE.data;
              $rootScope.userApp.network= r.network;
              //$rootScope.userApp.access_token= rLogin.authResponse.access_token;
              $rootScope.userApp.access_token= ' - ';
              $rootScope.userApp.client_id= r.id;
              $rootScope.loggedin = true;
              cargarHistorial();
              //console.log($rootScope.userApp);
              UsersSvc.updateUser($rootScope.userApp, $rootScope.userApp.id).then(function(updatedResult){
                console.log(updatedResult);
              });

          } else {
            //Previous UserEmail: FALSE | SIGNUP
            console.log('New User. Signing Up');
            $scope.newUser = {};
            $scope.newUser.name = r.name;
            $scope.newUser.email = r.email;
            $scope.newUser.network= r.network;
            $scope.newUser.access_token= ' - ';
            $scope.newUser.client_id= r.id;
            UsersSvc.createUser($scope.newUser).then(function(result){
              if(result.data){
                $rootScope.loggedin = true;
                $rootScope.userApp = $scope.newUser;
                $rootScope.userApp.id = result.data;
                cargarHistorial();
              }
            });
          } // ends signup with network
        });
      }
    });

  }



  $scope.logout = function(){
    hello('facebook').logout();
    hello('google').logout();
    $scope.choose     = true;
    $scope.signUpForm = false;
    $scope.signInForm = false;
    $rootScope.loggedin = false;
    $rootScope.userApp = {};
  }

  $scope.editarPerfil = function(){
    ons.createDialog('editProfile.html').then(function(dialog){
      dialog.show();
    });
  }

  $scope.cancelUpdatePerfil = function(){
    $scope.userApp.name = prevProfile.name;
    $scope.userApp.email = prevProfile.email;
    $scope.userApp.tel = prevProfile.tel;
  }
  $scope.actualizarPerfil = function(){
    UsersSvc.updateUser($scope.userEdit, $scope.userApp.id).then(function(result){
      console.log(result);
    });
  }


  $


});



moduleapp.controller('AcercaCtrl', function ($scope) {
    $('.waves').parallax({ limitY: 30, scalarX: 20 });
});
