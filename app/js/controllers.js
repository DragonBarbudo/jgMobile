
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



$scope.clean = function(str){
    str = str.replace( /\[(.+?)\]/g , '' );
    return str;
  }


if(!$rootScope.zona){
  var nupaths = { path:[ ] };
  for(var i=0;i<zonaJagergin.todo.path.length; i++){  nupaths.path.push( {lat:zonaJagergin.todo.path[i].latitude, lng:zonaJagergin.todo.path[i].longitude } );  }
  var area = new google.maps.Polygon( {paths: nupaths.path });
  var posOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 0};
  var geocoder = new google.maps.Geocoder();
  $cordovaGeolocation.getCurrentPosition(posOptions).then(function (data) {
    $scope.coords = { lat:data.coords.latitude, lng: data.coords.longitude };
    $scope.map.control.refresh( {latitude: $scope.coords.lat, longitude: $scope.coords.lng} );
    $scope.isInZone = area.containsLatLng(new google.maps.LatLng($scope.coords.lat, $scope.coords.lng));
  }); //ends geolocation
  uiGmapGoogleMapApi.then(function(maps) {
    setTimeout(function(){ $('.zonaJagergin .gm-style').append('<div class="centerPin"><img src="app/img/icon_marker.png"></div>'); }, 2000);
    $scope.coords = { lat:19.3981294, lng: -99.1203205 };
      $scope.map = {
        control : {},
        center: { latitude: $scope.coords.lat, longitude: $scope.coords.lng },
        zoom: 11,
        options: {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          styles: gmapStyle
        },
        events:{
          dragend: function(e){
            var point = e.center;
            $scope.isInZone = area.containsLatLng(point);
          }
        }
      }
      $scope.polygons = zonaJagergin;

  }, function(err){
    alert('Debes tener la ubicación activa en tu dispositivo. Modifica los ajustes.');
    console.log(err);
  }); //ends uiGmapGoogleMapApi

    uiGmapIsReady.promise(1).then(function(instances){
      cfpLoadingBar.complete();
    });
} // ENDS inZone



  $scope.scrollBottom = function(){
    $('.page__content').animate({ scrollTop: 420 }, 1000);
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
    localStorageService.set('cart',ShoppingCartSvc.getCart());

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


  $scope.clean = function(str){
    str = str.replace( /\[(.+?)\]/g , '' );
    return str;
  }


});











moduleapp.controller('BusquedaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, CategoriesSvc, $filter) {
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
          $scope.products = resultPrd.data;
          console.log($scope.products.length);
          for(var i = 0; i<$scope.products.length; i++){
            console.log($scope.products[i]);
            var found = $filter('filter')($scope.categories, {id:$scope.products[i].categories_id}, true);
            $scope.products[i].categoryName = found[0].name;
          }
      });
    }
  }

  $scope.addToCart = function(theItem){
    ShoppingCartSvc.addItem(theItem);
    localStorageService.set('cart',ShoppingCartSvc.getCart());
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


    $scope.clean = function(str){
    str = str.replace( /\[(.+?)\]/g , '' );
    return str;
  }

});



moduleapp.controller('CuentaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, UsersSvc, StoreLocalSvc, $filter, $rootScope, OrdersSvc, $cordovaOauth, $http, localStorageService) {



  $scope.url = SettingSvc.getPhotoUrl();
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
  prevProfile.lastname = $scope.userEdit.lastname;
  prevProfile.email = $scope.userEdit.email;
  prevProfile.tel = $scope.userEdit.tel;


  $scope.historial = {};
  $scope.historialItems = {};

  $scope.reloadparam = Math.random();


  if($rootScope.userApp.name!=""){
    cargarHistorial();
  }

$scope.cartCount;

$scope.$watch(function () {
     return ShoppingCartSvc.count();
   },
    function() {
      $scope.cartCount = ShoppingCartSvc.count();
  }, true);


  $scope.signup = function(){
    $scope.newUser = {};
    $scope.newUser.name = $scope.signin.name;
    $scope.newUser.lastname = $scope.signin.lastname;
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
    if(!$scope.errorUsuario && $scope.signin.email && $scope.signin.name && $scope.signin.lastname && $scope.signin.tel && $scope.signin.password && $scope.signin.password2 ){
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
        localStorageService.set('user', $rootScope.userApp);
        cargarHistorial();
        loginRetorno();
      }
    });
  }

  function loginRetorno(){
    if($rootScope.retorno){ Navigator.pushPage('app/view/carrito.html'); $rootScope.retorno=false; }
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

  if(network=='google'){

    $cordovaOauth.google('473012819-cv5rgbmt6tjf8h4b8h2go7a4f89q9g6r.apps.googleusercontent.com', ["email"]).then(function(result) {
      console.log(result);
      var token = result.access_token;
      $http.get("https://www.googleapis.com/oauth2/v2/userinfo", { params: { access_token: token, fields: "id,name,email,picture", format: "json" }}).then(function(resultME) {
        console.log(resultME.data);
        var user = {};
        user.id = resultME.data.id;
        user.name = resultME.data.name;
        user.email = resultME.data.email;
        user.picture = resultME.data.picture;
        loginNetwork(user, network);
      }, function(error) {
          alert("Ocurrió un problema con tu perfil. Intentalo de nuevo.");
          console.log(error);
      });
    }, function(error) {
        // error
        console.log('error: ' + error);
        alert('Error al iniciar sesión. Intente de nuevo.');
    });
  }

  if(network=="facebook"){
    $cordovaOauth.facebook("613671772113193", ["email"]).then(function(result) {
            // results
            console.log(result);
            var token = result.access_token;
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: token, fields: "id,name,email,picture", format: "json" }}).then(function(resultME) {
              console.log(resultME.data);
              var user = {};
              user.id = resultME.data.id;
              user.name = resultME.data.name;
              user.email = resultME.data.email;
              user.picture = resultME.data.picture.data.url;
              loginNetwork(user, network);
            }, function(error) {
                alert("Ocurrió un problema con tu perfil. Intentalo de nuevo.");
                console.log(error);
            });

        }, function(error) {
            // error
            console.log('error: ' + error);
            alert('Error al iniciar sesión. Intente de nuevo.');
        });
  }


  };



  function loginNetwork(r, network){
    console.log(r);
    //Validate Client_id
    UsersSvc.searchClientId(r.id).then(function(resultC){
      if(resultC.data){
        //Exists:TRUE | Then SIGNIN
        console.log('Client ID Exists. Signing In');
        $rootScope.userApp = resultC.data;
        $rootScope.loggedin = true;
        cargarHistorial();
        loginRetorno();
        localStorageService.set('user', $rootScope.userApp);
      } else {
        //Exists:FALSE | Check if previous email
        console.log('Client ID null. Searching by Email');
        UsersSvc.searchUser(r.email).then(function(resultE){
          if(resultE.data){
            //Previous UserEmail: TRUE | Update & SIGNIN
              console.log('Client Email Exists. Updating with Network & Signing In');
              console.log(resultE.data.name);
              $rootScope.userApp = resultE.data;
              $rootScope.userApp.network= network;
              $rootScope.userApp.access_token= ' - ';
              $rootScope.userApp.client_id= r.id;
              $rootScope.loggedin = true;
              cargarHistorial();
              loginRetorno();
              //console.log($rootScope.userApp);
              UsersSvc.updateUser($rootScope.userApp, $rootScope.userApp.id).then(function(updatedResult){
                console.log(updatedResult);
                localStorageService.set('user', $rootScope.userApp);
              });

          } else {
            //Previous UserEmail: FALSE | SIGNUP
            console.log('New User. Signing Up');
            $scope.newUser = {};
            $scope.newUser.name = r.name;
            $scope.newUser.lastname = r.last_name;
            $scope.newUser.email = r.email;
            $scope.newUser.network= network;
            $scope.newUser.access_token= ' - ';
            $scope.newUser.client_id= r.id;
            UsersSvc.createUser($scope.newUser).then(function(result){
              if(result.data){
                $rootScope.userApp = $scope.newUser;
                $rootScope.userApp.id = result.data;

                var picture = r.picture;
                if(network == 'facebook'){ picture = picture+"&width=300";  }
                if(network == 'google'){ picture = picture+"?sz=300"; }

                UsersSvc.remoteImage(picture, $rootScope.userApp.id).then(function(imageResult){
                  console.log(imageResult);
                  $rootScope.loggedin = true;
                  if($scope.regreso){$state.go('carrito');}
                  $scope.reloadparam = Math.random();
                  localStorageService.set('user', $rootScope.userApp);
                  cargarHistorial();
                  loginRetorno();


                });



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
    localStorageService.remove('user');
  }

  $scope.editarPerfil = function(){
    ons.createDialog('editProfile.html').then(function(dialog){
      dialog.show();
    });
  }

  $scope.cancelUpdatePerfil = function(){
    $scope.userApp.name = prevProfile.name;
    $scope.userApp.lastname = prevProfile.lastname;
    $scope.userApp.email = prevProfile.email;
    $scope.userApp.tel = prevProfile.tel;
  }
  $scope.actualizarPerfil = function(){
    UsersSvc.updateUser($scope.userEdit, $scope.userApp.id).then(function(result){
      console.log(result);
    });
  }


  $scope.uploadImage = function(files){
    console.log(files[0]);
      var fd = new FormData();
        fd.append("image", files[0]);
        fd.append("name", 'id_'+$scope.userApp.id);
        console.log(fd);
        UsersSvc.uploadImage(fd).then(function(result){
          console.log(result);
          $scope.reloadparam = Math.random();
          menu.setMainPage('app/view/cuenta.html');
        });
    }


});



moduleapp.controller('AcercaCtrl', function ($scope) {
    $('.waves').parallax({ limitY: 30, scalarX: 20 });
});
